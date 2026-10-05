const registrationDialog = document.getElementById('registration-dialog');
const registrationButton = document.getElementById('register-button');
registrationButton.addEventListener('click', () => registrationDialog.showModal());
document.getElementById('close-registration').addEventListener('click', () => registrationDialog.close());
registrationDialog.addEventListener('close', () => registrationButton.focus());
const demoStages = [
  {name:'Build',title:'Improve the system around the model.',copy:'Form a team of 1–3. Build or adapt a harness around HY4 and release the submitted harness under AGPL.',rules:['model','license']},
  {name:'Practice',title:'Learn from the five public tasks.',copy:'Develop in the simulated lab. Five tasks are public; 44 are hidden during the event. No quantum hardware is required.',rules:['tasks']},
  {name:'Evaluate',title:'Three full evaluations, at most.',copy:'Each official evaluation covers all 49 tasks. The verifier checks experimental evidence. This three-run allowance is separate from development calls.',rules:['runs','tasks']},
  {name:'Awards',title:'Two distinct paths to an award.',copy:'The automated top five proceed to expert review for placement prizes. Separately, only the first qualifying HY4 team strictly above the frozen Astra hidden baseline wins the Challenger Award.',rules:['placement','challenger']}
];
let demoStage=0;
const stepButtons=[...document.querySelectorAll('[data-stage]')];
function showStage(index){
  demoStage=index;
  const stage=demoStages[index];
  stepButtons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  document.querySelectorAll('[data-panel]').forEach(panel=>panel.hidden=Number(panel.dataset.panel)!==index);
  document.querySelectorAll('[data-rule]').forEach(rule=>rule.classList.toggle('is-related',stage.rules.includes(rule.dataset.rule)));
  document.getElementById('demo-step-label').textContent=`0${index+1} / ${stage.name.toUpperCase()}`;
  document.getElementById('demo-step-title').textContent=stage.title;
  document.getElementById('demo-step-copy').textContent=stage.copy;
  document.getElementById('demo-next').textContent=index===3?'Back to Build':`Next: ${demoStages[index+1].name}`;
}
stepButtons.forEach(button=>button.addEventListener('click',()=>showStage(Number(button.dataset.stage))));
document.getElementById('demo-next').addEventListener('click',()=>showStage((demoStage+1)%4));
const taskMatrix=document.getElementById('practice-matrix');
for(let i=0;i<49;i++){const cell=document.createElement('i');cell.setAttribute('aria-hidden','true');if(i<5)cell.className='public-task';taskMatrix.append(cell);}
showStage(0);
