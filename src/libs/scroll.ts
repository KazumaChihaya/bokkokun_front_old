export function getScrollTop(): number {
  return document.body.scrollTop || document.documentElement.scrollTop;
}

export function getScrollMax(): [number, number] {
  const height = document.documentElement.scrollHeight;
  const cheight = document.documentElement.clientHeight;
  return [height - cheight, height];
}
