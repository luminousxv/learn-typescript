var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// utils
function $(selector) {
    return document.querySelector(selector);
}
function getUnixTimestamp(date) {
    return new Date(date).getTime();
}
// DOM
const confirmedTotal = $('.confirmed-total');
const deathsTotal = $('.deaths');
const recoveredTotal = $('.recovered');
const lastUpdatedTime = $('.last-updated-time');
const rankList = $('.rank-list');
const deathsList = $('.deaths-list');
const recoveredList = $('.recovered-list');
const deathSpinner = createSpinnerElement('deaths-spinner');
const recoveredSpinner = createSpinnerElement('recovered-spinner');
const canvas = $('#lineChart');
function createSpinnerElement(id) {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.setAttribute('id', id);
    wrapperDiv.setAttribute('class', 'spinner-wrapper flex justify-center align-center');
    const spinnerDiv = document.createElement('div');
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
function fetchCovidSummary() {
    const url = 'https://api.covid19api.com/summary';
    return axios.get(url);
}
function fetchCountryInfo(countryCode, status) {
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
function initEvents() {
    rankList.addEventListener('click', handleListClick);
}
function handleListClick(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedId = '';
        if (event.target instanceof HTMLParagraphElement || event.target instanceof HTMLSpanElement) {
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
        const { data: deathResponse } = yield fetchCountryInfo(selectedId, 'deaths');
        const { data: recoveredResponse } = yield fetchCountryInfo(selectedId, 'recovered');
        const { data: confirmedResponse } = yield fetchCountryInfo(selectedId, 'confirmed');
        endLoadingAnimation();
        setDeathsList(deathResponse);
        setTotalDeathsByCountry(deathResponse);
        setRecoveredList(recoveredResponse);
        setTotalRecoveredByCountry(recoveredResponse);
        setChartData(confirmedResponse);
        isDeathLoading = false;
        isRecoveredLoading = false;
    });
}
function setDeathsList(data) {
    const sorted = data.sort((a, b) => getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date));
    sorted.forEach((value) => {
        const li = document.createElement('li');
        li.setAttribute('class', 'list-item-b flex align-center');
        const span = document.createElement('span');
        span.textContent = value.Cases.toString();
        span.setAttribute('class', 'deaths');
        const p = document.createElement('p');
        p.textContent = new Date(value.Date).toLocaleDateString().slice(0, -1);
        li.appendChild(span);
        li.appendChild(p);
        deathsList.appendChild(li);
    });
}
function clearDeathList() {
    deathsList.innerHTML = null;
}
function setTotalDeathsByCountry(data) {
    deathsTotal.innerText = data[0].Cases.toString();
}
function setRecoveredList(data) {
    const sorted = data.sort((a, b) => getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date));
    sorted.forEach((value) => {
        const li = document.createElement('li');
        li.setAttribute('class', 'list-item-b flex align-center');
        const span = document.createElement('span');
        span.textContent = value.Cases.toString();
        span.setAttribute('class', 'recovered');
        const p = document.createElement('p');
        p.textContent = new Date(value.Date).toLocaleDateString().slice(0, -1);
        li.appendChild(span);
        li.appendChild(p);
        recoveredList.appendChild(li);
    });
}
function clearRecoveredList() {
    recoveredList.innerHTML = null;
}
function setTotalRecoveredByCountry(data) {
    recoveredTotal.innerText = data[0].Cases.toString();
}
function startLoadingAnimation() {
    deathsList.appendChild(deathSpinner);
    recoveredList.appendChild(recoveredSpinner);
}
function endLoadingAnimation() {
    deathsList.removeChild(deathSpinner);
    recoveredList.removeChild(recoveredSpinner);
}
function setupData() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield fetchCovidSummary();
        setTotalConfirmedNumber(data);
        setTotalDeathsByWorld(data);
        setTotalRecoveredByWorld(data);
        setCountryRanksByConfirmedCases(data);
        setLastUpdatedTimestamp(data);
    });
}
function renderChart(data, labels) {
    var ctx = canvas.getContext('2d');
    Chart.defaults.color = '#f5eaea';
    Chart.defaults.font.family = 'Exo 2';
    new Chart(ctx, {
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
function setChartData(data) {
    const chartData = data.slice(-14).map((value) => value.Cases);
    const chartLabel = data.slice(-14).map((value) => new Date(value.Date).toLocaleDateString().slice(5, -1));
    renderChart(chartData, chartLabel);
}
function setTotalConfirmedNumber(data) {
    confirmedTotal.innerText = data.Countries.reduce((total, current) => (total += current.TotalConfirmed), 0).toString();
}
function setTotalDeathsByWorld(data) {
    deathsTotal.innerText = data.Countries.reduce((total, current) => (total += current.TotalDeaths), 0).toString();
}
function setTotalRecoveredByWorld(data) {
    recoveredTotal.innerText = data.Countries.reduce((total, current) => (total += current.TotalRecovered), 0).toString();
}
function setCountryRanksByConfirmedCases(data) {
    const sorted = data.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
    sorted.forEach((value) => {
        const li = document.createElement('li');
        li.setAttribute('class', 'list-item flex align-center');
        li.setAttribute('id', value.Slug);
        const span = document.createElement('span');
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
function setLastUpdatedTimestamp(data) {
    lastUpdatedTime.innerText = new Date(data.Countries[0].Date).toLocaleString();
}
startApp();
