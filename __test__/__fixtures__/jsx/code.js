import './style.module.css';
function Test() {
  return
    <>
      <div className='test'></div>
      <div className='test1 test2'></div>
      <div className={`${Math.random() > .5 ? 'a' : 'b'}`}></div>
      <div className={(function(a, b){})('a','b')}></div>
      <div className={((a, b) => {})('a','b')}></div>
      <div className={fn('a','b')}></div>
      <div className={[].map(() => {})}></div>
      <div className={Math.random() > .5 ? 'a' : 'b'}></div>
      <div className={['a','b']}></div>
      <div className={a = 'a'}></div>
      <div className={'a' + 'b'}></div>
      <div className={'a'}></div>
      <div className={function(){}}></div>
      <div className={() => {}}></div>
      <div className={class{}}></div>
      <div className={a}></div>
      <div className={this}></div>
    </>;
}