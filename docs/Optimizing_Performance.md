# Optimizing Performance

在 React 内部，React 使用了几种聪明的方式组大话的压缩了更新 UI 时必要的 DOM 操作带来的开销。对于许多普通的应用，使用 React 就能够在不做特殊性能优化的情况下达到一个比较理想的 UI 渲染速度。然而，还是有几种方式来加速 React 应用。

### Use The Production Build

如果在你的 React 应用中检测或者遇到了性能问题，请先从以下几种产品构建着手测试：

* 