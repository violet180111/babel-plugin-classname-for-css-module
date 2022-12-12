export default function getClassName(className: string, styleObj: Record<string, string>) {
  return className
    .split(' ')
    .map((c) => styleObj[c])
    .filter(Boolean)
    .join(' ');
}
