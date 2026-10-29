const { test }=require('node:test');
const assert=require('node:assert/strict');
const { readFileSync }=require('node:fs');
const vm=require('node:vm');
const context=vm.createContext({});
vm.runInContext(readFileSync(require('node:path').join(__dirname,'../data.js'),'utf8'),context);
const calculate=answers=>context.calculateSurvival(answers);
const evaluate=answers=>context.evaluatePath(answers);
const samplePaths=[];
let seed=17;
for(let i=0;i<12000;i++) samplePaths.push(Array.from({length:12},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed>>>30}));
test('12,000 reproducible paths yield bounded coherent endings and all six survivor types',()=>{
  const types=new Set(); let minimum=60,maximum=0;
  for(const answers of samplePaths){
    const r=calculate(answers);types.add(r.type);minimum=Math.min(minimum,r.days);maximum=Math.max(maximum,r.days);
    assert.ok(Number.isInteger(r.days)&&r.days>=2&&r.days<=60);
    assert.equal(r.open,r.days===60);
    assert.equal(r.record.length,4);
    assert.ok(r.ending.name&&r.ending.text&&r.survivor.name);
    assert.ok(r.dimensions.every(n=>n>=0&&n<=100));
    assert.ok(r.keyIndex>=0&&r.keyIndex<12);
    assert.ok(r.anchorIndex>=0&&r.anchorIndex<12);
    if(r.rewrite){
      assert.notEqual(r.rewrite.alternative,answers[r.rewrite.index]);
      const changed=answers.slice();changed[r.rewrite.index]=r.rewrite.alternative;
      const actual=evaluate(changed);
      assert.equal(actual.days,r.rewrite.days);
      assert.equal(actual.open,r.rewrite.open);
      assert.ok(r.rewrite.days>r.days);
    }
  }
  assert.equal(types.size,6);assert.equal(minimum,2);assert.equal(maximum,60);
});
test('counterfactual finds the best single replacement rather than an invented improvement',()=>{
  for(const answers of samplePaths.slice(0,200)){
    const r=calculate(answers); let best=r.days;
    answers.forEach((_,i)=>{for(let choice=0;choice<4;choice++){const changed=answers.slice();changed[i]=choice;best=Math.max(best,evaluate(changed).days)}});
    assert.equal(r.rewrite?.days||r.days,best);
    assert.equal(calculate(answers).days,r.days);
  }
});
test('prepared route reaches an open ending without a false death explanation',()=>{
  const r=calculate([0,1,1,0,1,1,1,0,0,1,0,1]);
  assert.equal(r.open,true);assert.equal(r.rewrite,null);assert.match(r.ending.name,/讯号仍在/);
});
test('rejects incomplete or invalid answers',()=>{
  for(const answers of [null,[],Array(11).fill(0),Array(13).fill(0),Array(12).fill(-1),Array(12).fill(4),Array(12).fill('1'),Array(12).fill(1.5)]) assert.throws(()=>calculate(answers));
});
