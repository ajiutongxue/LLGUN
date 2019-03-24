## 编辑中 input 的样式设置

#### input-box

写在input-box上的样式，都属于历史包袱。





#### input

input 的背景颜色都是半透明的，适应在不同背景颜色上显示出同样的“深度”，因此，也就要求没有意义的背景颜色就不要乱设置。

```less
input[type="text"] {
    background: rgba(0,0,0,.15);
}
```



#### input:hover

```less
input[type="text"]:hover {
    background: rgba(0, 0, 0, 0.25);
}
```



#### input:focus

```less
input[type="text"]:focus {
    background: rgba(0,0,0,.4);
}
```

