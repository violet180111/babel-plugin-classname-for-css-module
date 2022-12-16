import './style1.module.css';
import './style2.module.css';
import './style3.module.css'/* test1 */;
import './style4.module.css'/* test2 */;

function Test() {
  return
    <>
      <div className='test'></div>
      <div className='test1 test2'></div>
      <div className='test1.a test2.b'></div>
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