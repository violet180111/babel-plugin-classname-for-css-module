type S = string;
type SR = Record<S, S>;

export default function getClassName(classNameWithStyleKey: S, styleObj: Record<S, SR | S>) {
  classNameWithStyleKey.replace(/\s{2,}/, ' ');

  const classNameList = classNameWithStyleKey.split(' ');

  return (
    Array.isArray(styleObj)
      ? classNameList.reduce((acc, cur) => `${acc} ${(<SR>styleObj[0])[cur]}`, '')
      : classNameList.reduce((acc, cur) => {
          const [key, name] = cur.split('.');
          const styleId = <S>styleObj[key];

          return `${acc} ${(<SR>styleObj[styleId])[name]}`;
        }, '')
  ).trimStart();
}
