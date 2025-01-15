# ohos-lifecycle
类 Lifecycle 接口的生命周期监听和注册以及 ViewModel 管理

***

## Startup

### 注册 Ability

继承`LifecycleAbility`

```ts
export default class EntryAbility extends LifecycleAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    super.onCreate(want, launchParam)
  }
  
  onDestroy(): void {
    super.onDestroy();
  }
}
```

或者在已有`Ability`中调用注册方法

```ts
export default class EntryAbility extends UIAbilitiy {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    LifecycleAbility.register(this)
  }
  
  onDestroy(): void {
    LifecycleAbility.unregister(this)
  }
}
```

***

## 方法说明

### Lifecycle

#### 在 Page / Component 中获取 Lifecycle 对象

同一个页面中无论何处获得的`Lifecycle`对象均为同一个

```ts
@ComponentV2
struct Component {
	private lifecycle!: Lifecycle
	
  aboutToAppear(): void {
        this.lifecycle = Lifecycle.getOrCreate(this)
    }
}
```

#### 向 Lifecycle 中注册监听器

```ts
this.lifecycle.addObserver({
    onStateChanged: (state) => {
        promptAction.showToast({
            message: "onStateChanged " + state
        })
    }
} as LifecycleEventObserver)
```

```ts
this.lifecycle.addObserver({
    aboutToAppear: () => { ... },
    aboutToDisappear: () => { ... },
    onPageShow: () => { ... },
    onPageHide: () => { ... },
    onBackPress: () => { ... },
} as DefaultLifecycleObserver)
```

### ViewModel

#### 在 Page / Component 中获取指定 ViewModel

在同一个页面中无论何处获得相同类型同名的`ViewModel`实例对象均为同一个

```ts
@ComponentV2
struct Component {
	get viewModel() {
    ViewModelProvider.of(this).get(MyViewModel [, "viewModelName"])
  }
}

class MyViewModel extends ViewModel {
  
}
```

#### Closeable

将实现 `Closeable`的对象添加到`ViewModel`中，`ViewModel`被 clear 时将自动调用 `Closeable` 的 `close` 方法

```ts
class MyViewModel extends ViewModel {
  init() {
  	this.addCloseable({
  		close() {
  			// ...
  		}
  	})
  }
}
```

### Scope

提供`LifecycleScope`和`ViewModelScope`

两者均仅在页面生命周期在`onPageShow`时才运行提交的任务，在`onPageHide`时暂停执行还未执行的任务，在对应的组件生命周期结束后停止执行还未执行的任务

```ts
@ComponentV2
struct Component {
	
  aboutToAppear(): void {
        Lifecycle.getOrCreate(this).lifecycleScope.launch(() => {
        	//...
        })
    }
}
```

```ts
class MyViewModel extends ViewModel {
  init() {
  	this.viewModelScope.launch(() => {
  		//...
  	})
  }
}
```

