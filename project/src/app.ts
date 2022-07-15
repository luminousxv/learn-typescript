import axios from 'axios';
import Chart from 'chart.js';
import { Summary, status, LiveCountryInfo } from './types/type';
// utils
function $(selector: string): HTMLElement {
  return document.querySelector(selector);
}
function getUnixTimestamp(date: string): number {
  return new Date(date).getTime();
}

// DOM
const confirmedTotal = $('.confirmed-total') as HTMLSpanElement;
const deathsTotal = $('.deaths') as HTMLParagraphElement;
const recoveredTotal = $('.recovered') as HTMLParagraphElement;
const lastUpdatedTime = $('.last-updated-time') as HTMLParagraphElement;
const rankList = $('.rank-list') as HTMLOListElement;
const deathsList = $('.deaths-list') as HTMLOListElement;
const recoveredList = $('.recovered-list') as HTMLOListElement;
const deathSpinner = createSpinnerElement('deaths-spinner');
const recoveredSpinner = createSpinnerElement('recovered-spinner');
const canvas = $('#lineChart') as HTMLCanvasElement;

function createSpinnerElement(id: string): HTMLDivElement {
  const wrapperDiv: HTMLDivElement = document.createElement('div');
  wrapperDiv.setAttribute('id', id);
  wrapperDiv.setAttribute(
    'class',
    'spinner-wrapper flex justify-center align-center'
  );
  const spinnerDiv: HTMLDivElement = document.createElement('div');
  spinnerDiv.setAttribute('class', 'ripple-spinner');
  spinnerDiv.appendChild(document.createElement('div'));
  spinnerDiv.appendChild(document.createElement('div'));
  wrapperDiv.appendChild(spinnerDiv);
  return wrapperDiv;
}

// state
let isDeathLoading = false;
let isRecoveredLoading = false;

// api
function fetchCovidSummary(): Promise<Summary> {
  const url = 'https://api.covid19api.com/summary';
  return axios.get(url);
}

function fetchCountryInfo(
  countryCode: string,
  status: status
): Promise<LiveCountryInfo> {
  // params: confirmed, recovered, deaths
  const url = `https://api.covid19api.com/country/${countryCode}/status/${status}`;
  return axios.get(url);
}

// methods
function startApp() {
  setupData();
  initEvents();
}

// events
function initEvents(): void {
  rankList.addEventListener('click', handleListClick);
}

async function handleListClick(event: MouseEvent): Promise<void> {
  let selectedId = '';
  if (
    event.target instanceof HTMLParagraphElement ||
    event.target instanceof HTMLSpanElement
  ) {
    selectedId = event.target.parentElement.id;
  }
  if (event.target instanceof HTMLLIElement) {
    selectedId = event.target.id;
  }
  if (isDeathLoading || isRecoveredLoading) {
    return;
  }
  clearDeathList();
  clearRecoveredList();
  startLoadingAnimation();
  isDeathLoading = true;
  isRecoveredLoading = true;
  const { data: deathResponse } = await fetchCountryInfo(selectedId, 'deaths');
  const { data: recoveredResponse } = await fetchCountryInfo(
    selectedId,
    'recovered'
  );
  const { data: confirmedResponse } = await fetchCountryInfo(
    selectedId,
    'confirmed'
  );
  endLoadingAnimation();
  setDeathsList(deathResponse);
  setTotalDeathsByCountry(deathResponse);
  setRecoveredList(recoveredResponse);
  setTotalRecoveredByCountry(recoveredResponse);
  setChartData(confirmedResponse);
  isDeathLoading = false;
  isRecoveredLoading = false;
}

function setDeathsList(data: LiveCountryInfo['data']): void {
  const sorted: LiveCountryInfo['data'] = data.sort(
    (a, b) => getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date)
  );
  sorted.forEach(value => {
    const li: HTMLElement = document.createElement('li');
    li.setAttribute('class', 'list-item-b flex align-center');
    const span: HTMLSpanElement = document.createElement('span');
    span.textContent = value.Cases.toString();
    span.setAttribute('class', 'deaths');
    const p: HTMLParagraphElement = document.createElement('p');
    p.textContent = new Date(value.Date).toLocaleDateString().slice(0, -1);
    li.appendChild(span);
    li.appendChild(p);
    deathsList.appendChild(li);
  });
}

function clearDeathList(): void {
  deathsList.innerHTML = null;
}

function setTotalDeathsByCountry(data: LiveCountryInfo['data']): void {
  deathsTotal.innerText = data[0].Cases.toString();
}

function setRecoveredList(data: LiveCountryInfo['data']) {
  const sorted: LiveCountryInfo['data'] = data.sort(
    (a, b) => getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date)
  );
  sorted.forEach(value => {
    const li: HTMLElement = document.createElement('li');
    li.setAttribute('class', 'list-item-b flex align-center');
    const span: HTMLSpanElement = document.createElement('span');
    span.textContent = value.Cases.toString();
    span.setAttribute('class', 'recovered');
    const p: HTMLParagraphElement = document.createElement('p');
    p.textContent = new Date(value.Date).toLocaleDateString().slice(0, -1);
    li.appendChild(span);
    li.appendChild(p);
    recoveredList.appendChild(li);
  });
}

function clearRecoveredList(): void {
  recoveredList.innerHTML = null;
}

function setTotalRecoveredByCountry(data: LiveCountryInfo['data']): void {
  recoveredTotal.innerText = data[0].Cases.toString();
}

function startLoadingAnimation(): void {
  deathsList.appendChild(deathSpinner);
  recoveredList.appendChild(recoveredSpinner);
}

function endLoadingAnimation() {
  deathsList.removeChild(deathSpinner);
  recoveredList.removeChild(recoveredSpinner);
}

async function setupData() {
  const { data }: Summary = await fetchCovidSummary();
  setTotalConfirmedNumber(data);
  setTotalDeathsByWorld(data);
  setTotalRecoveredByWorld(data);
  setCountryRanksByConfirmedCases(data);
  setLastUpdatedTimestamp(data);
}

function renderChart(data: number[], labels: string[]): void {
  const ctx = canvas.getContext('2d');
  Chart.defaults.color = '#f5eaea';
  Chart.defaults.font.family = 'Exo 2';
  new Chart(ctx as CanvasRenderingContext2D, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Confirmed for the last two weeks',
          backgroundColor: '#feb72b',
          borderColor: '#feb72b',
          data,
        },
      ],
    },
    options: {},
  });
}

function setChartData(data: LiveCountryInfo['data']): void {
  const chartData: number[] = data.slice(-14).map(value => value.Cases);
  const chartLabel: string[] = data
    .slice(-14)
    .map(value => new Date(value.Date).toLocaleDateString().slice(5, -1));
  renderChart(chartData, chartLabel);
}

function setTotalConfirmedNumber(data: Summary['data']): void {
  confirmedTotal.innerText = data.Countries.reduce(
    (total, current) => (total += current.TotalConfirmed),
    0
  ).toString();
}

function setTotalDeathsByWorld(data: Summary['data']): void {
  deathsTotal.innerText = data.Countries.reduce(
    (total, current) => (total += current.TotalDeaths),
    0
  ).toString();
}

function setTotalRecoveredByWorld(data: Summary['data']): void {
  recoveredTotal.innerText = data.Countries.reduce(
    (total, current) => (total += current.TotalRecovered),
    0
  ).toString();
}

function setCountryRanksByConfirmedCases(data: Summary['data']) {
  const sorted = data.Countries.sort(
    (a, b) => b.TotalConfirmed - a.TotalConfirmed
  );
  sorted.forEach(value => {
    const li: HTMLElement = document.createElement('li');
    li.setAttribute('class', 'list-item flex align-center');
    li.setAttribute('id', value.Slug);
    const span: HTMLSpanElement = document.createElement('span');
    span.textContent = value.TotalConfirmed.toString();
    span.setAttribute('class', 'cases');
    const p = document.createElement('p');
    p.setAttribute('class', 'country');
    p.textContent = value.Country;
    li.appendChild(span);
    li.appendChild(p);
    rankList.appendChild(li);
  });
}

function setLastUpdatedTimestamp(data: Summary['data']) {
  lastUpdatedTime.innerText = new Date(data.Countries[0].Date).toLocaleString();
}

startApp();
