type S = string;
type SR = Record<S, S>;

export default function getClassName(
  classNameWithStyleKey: S,
  styleObj: Record<S, SR | S> | Array<SR>,
) {
  classNameWithStyleKey.replace(/\s{2,}/, ' ');

  const classNameList = classNameWithStyleKey.split(' ');
  const isArray = Array.isArray(styleObj);

  return classNameList
    .reduce((acc, cur) => {
      const [key, name] = cur.split('.');
      const className = isArray
        ? styleObj[0][name ?? key]
        : (<SR>styleObj[<string>(<Record<S, SR | S>>styleObj)[key]])[name];

      return `${acc} ${className ?? cur}`;
    }, '')
    .trimStart();
}
