## select 的样式设置

#### 容器
下拉框被这样一个容器包裹

- container
```less
.container {
    position: absolute;                     // 可变
    border-radius: 0 0 2px 2px;
    left: -8px;                             // 可变
    top: 33px;                              // 可变
    width: 72px;                            // 可变
    z-index: 98;                            // 可变
    box-shadow: 0 3px 8px rgba(0,0,0,.6);
    line-height: 1.8em;
    background: @bg-1;
    border: 1px solid @border-color-1;
}
```

#### 元素
每行的每个选项就是一个item

- item--normal
```less
item {
    padding: 0 5px 0 8px;                   // 可变
    color: @font-color-2;
    transition: .3s;
}
```

- item--hover
```less
item {
    &:not(.item--selected, .item--disabled):hover {
        color: @dark-text-color--normal;
        background: @bg-2;
    }
}
```  
  
- item--selected
```less
item {
    &.item--selected {
        cursor: default;                    // 待确定
        color: lighten(@brand-color, 15%);
    }
}
```

- item--disabled
```less
item {
    &.item--disabled {
        cursor:not-allowed;
        opacity: .7;                        // 待确定
    }
}
```
