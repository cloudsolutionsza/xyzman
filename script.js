const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => navLinks.classList.toggle('show'));

// Close mobile menu after selecting a section
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
});

let selectedType = 'random';
const pills = document.querySelectorAll('.pill');
const lengthSelect = document.getElementById('passwordLength');
const output = document.getElementById('passwordOutput');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const strengthText = document.getElementById('strengthText');
const entropyText = document.getElementById('entropyText');
const meterFill = document.getElementById('meterFill');

pills.forEach((pill) => {
  pill.addEventListener('click', () => {
    pills.forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    selectedType = pill.dataset.type;
  });
});

const words = ['cloud','secure','growth','green','server','trust','logic','signal','south','workspace','backup','admin','digital','future'];
const symbols = '!@#$%&*?';
const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';

function randomFrom(set){
  return set[Math.floor(Math.random() * set.length)];
}

function generateRandom(length){
  const all = letters + numbers + symbols;
  let password = '';
  password += randomFrom(letters);
  password += randomFrom(numbers);
  password += randomFrom(symbols);
  while(password.length < length){ password += randomFrom(all); }
  return shuffle(password).slice(0, length);
}

function generateMemorable(length){
  let password = '';
  while(password.length < length){
    const word = words[Math.floor(Math.random() * words.length)];
    password += word.charAt(0).toUpperCase() + word.slice(1) + randomFrom(numbers);
    if(password.length < length) password += randomFrom(['-','_','.']);
  }
  return password.slice(0, length);
}

function generatePin(length){
  let pin = '';
  while(pin.length < length){ pin += randomFrom(numbers); }
  return pin;
}

function shuffle(str){
  return str.split('').sort(() => Math.random() - 0.5).join('');
}

function getCharsetSize(password){
  let size = 0;
  if(/[a-z]/.test(password)) size += 26;
  if(/[A-Z]/.test(password)) size += 26;
  if(/[0-9]/.test(password)) size += 10;
  if(/[^a-zA-Z0-9]/.test(password)) size += 33;
  return size || 1;
}

function ratePassword(password){
  const charset = getCharsetSize(password);
  const entropy = Math.round(password.length * Math.log2(charset));
  let label = 'Weak';
  let width = 25;
  if(entropy >= 50){ label = 'Good'; width = 55; }
  if(entropy >= 75){ label = 'Strong'; width = 78; }
  if(entropy >= 100){ label = 'Excellent'; width = 100; }
  return { entropy, label, width };
}

function updatePassword(){
  const length = parseInt(lengthSelect.value, 10);
  let password = '';
  if(selectedType === 'random') password = generateRandom(length);
  if(selectedType === 'memorable') password = generateMemorable(length);
  if(selectedType === 'pin') password = generatePin(length);
  output.value = password;
  const rating = ratePassword(password);
  strengthText.textContent = `Strength: ${rating.label}`;
  entropyText.textContent = `Entropy: ${rating.entropy} bits`;
  meterFill.style.width = `${rating.width}%`;
}

generateBtn.addEventListener('click', updatePassword);
copyBtn.addEventListener('click', async () => {
  try{
    await navigator.clipboard.writeText(output.value);
    copyBtn.textContent = 'Copied';
    setTimeout(() => copyBtn.textContent = 'Copy', 1200);
  }catch(error){
    output.select();
    document.execCommand('copy');
  }
});

updatePassword();
