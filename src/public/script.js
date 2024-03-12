const form = document.querySelector('form');
const filesContainer = document.getElementById('files-container');
const searchBar = document.getElementById('search-bar');
const searchBarContainer = document.getElementById('search-bar-container');
const fileNameInput = document.getElementById('name');
const csvInput = document.getElementById('csv');
const homeBtn = document.getElementById('home-btn');
const uploadForm = document.getElementById('upload-form');

const homeContainer = document.getElementById('home-container')
const dataContainer = document.getElementById('data-container');

let currentFullData;
let currentFilename;



uploadForm.addEventListener('submit', async(event)=>{
    event.preventDefault();

    const formData = new FormData(uploadForm);
    console.log(formData);

    try{  
        const response = await fetch('/csv/add', {
            method:'POST',
            body: formData
        });
        console.log(response);

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }


        const data = await response.json();
        const name = data.file[data.file.length - 1].name;
        const filename = data.file[data.file.length - 1].filename;
        console.log("response name : " + name);
        console.log("response filename : " + filename);
        if(name){
            console.log("in if statement")
            const createEl = document.createElement('div');
            createEl.innerHTML = `<h3>${name}</h3>
                                  <button onclick='getFileData(event, 0, 100)' data-id = '${filename}'>Show Data</button>`
            // createEl.setAttribute('data-id', `${filename}`);
            console.log("after createEL.innerhtmls")
            fileNameInput.value = '';
            console.log("after filename input")
            csvInput.value = '';
            console.log("after CSV input")
            currentFullData = null;
            uploadForm.reset();
            createEl.classList.add('file');
            filesContainer.appendChild(createEl);
        }
        

    }catch (error) {
        console.error('Error:', error.message);
    }
})

homeBtn.addEventListener('click', (event)=>{
  event.preventDefault();
  homeContainer.style.display = 'block';
  dataContainer.style.display = 'none';
})

//Get csv file 
async function getFileData(event, si, ei){
  homeContainer.style.display = 'none';
  dataContainer.style.display = 'flex';

  const filename = event.target.getAttribute('data-id');
  currentFilename = filename;
  console.log(filename);
  try{
      const response = await fetch(`/csv/get/${filename}`, {
          method: 'GET',
      });
      const csvData = await response.text();
      // console.log(csvData);
        // Use PapaParse to parse CSV data
        Papa.parse(csvData, {
          header: true, // Treat the first row as headers
          dynamicTyping: true, // Automatically detect and convert numeric values
          complete: function (results) {
              // console.log(results.data);
            const totalRecords = results.data.length;
            currentFullData = results.data;

            createDataPage(results.data.slice(si, ei), totalRecords, si, ei, filename);

            
          },
          error: function (error) {
              console.error('Error:', error.message);
          },
      });

  }catch (error) {
      console.error('Error:', error.message);
  }
}


//Create data page
function createDataPage(data, totalRecords, si, ei, filename){
  console.log(data);
  //Create header with total records and current records
  createPageHeader(totalRecords, si, ei);

  //Create Table
  createTable(data);

// console.log(data.length);
  
//Create Pagination;
  createPagination(totalRecords, filename);
  
}


function createPageHeader(totalRecords, si, ei){
    // const headerContainer  = document.getElementById('data-header-container');
    const totalRows = document.getElementById('total-rows');
    const currentRows = document.getElementById('current-rows');

    totalRows.textContent = `Total Rows: ${totalRecords}`;
    if(totalRecords > 100){
      currentRows.textContent = `Showing Results: ${si+1}-${ei}`
    }else{
      currentRows.textContent = '' ;
    }
}


//Create Html table function assuming that there are headers available for each column
function createTable(data) {

  addListenerToSearchBar(data);
  // Create the HTML table
  const table = document.createElement('table');

  // Create table headers
  const headerRow = document.createElement('tr');
  const headers = Object.keys(data[0]);
  console.log(headers);

  // Add "S.No." header
  const snoTh = document.createElement('th');
  snoTh.textContent = 'S.No.';
  headerRow.appendChild(snoTh);

  // Add other headers
  headers.forEach((header, index) => {
    const th = document.createElement('th');
    th.textContent = header;
    th.classList.add(`col${index}`)
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);
  
  // Create data rows
  data.forEach((rowData, outerIndex) => {
    const tr = document.createElement('tr');

    // Add Serial Number column
    const snoTd = document.createElement('td');
    snoTd.textContent = outerIndex + 1; // Serial numbers start from 1
    tr.appendChild(snoTd);

    // Add other data columns
    headers.forEach((header, innerIndex) => {
      const td = document.createElement('td');
      td.textContent = rowData[header];
      td.classList.add(`col${innerIndex}`)
      td.classList.add(`row${outerIndex}`)
      td.classList.add(`table-data`)
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  // Append the table to the container
  const tableContainer = document.getElementById('table-container');
  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
}



//Create pagination
function createPagination(totalRecords, filename){
  const totalPages =  parseInt(Math.ceil(totalRecords / 100));
  console.log(totalRecords);

  const paginationContainer = document.getElementById('data-pagination-container');
if(totalRecords > 100){
  console.log("if Entered");
  for(let i=0; i<totalPages; i++){
    const createEl = document.createElement('div');
    createEl.classList.add('page');
    createEl.setAttribute('data-id', i);
    createEl.innerHTML = `<h4>${i+1}</h4>`

    createEl.addEventListener('click',(event)=>{
        const clickedElement = event.currentTarget;
        const pageNumber = parseInt(clickedElement.getAttribute('data-id')) + 1;
        getPaginationData(pageNumber, filename);
    })
    paginationContainer.innerHTML='';
    paginationContainer.appendChild(createEl);
  } 
}else{
  paginationContainer.innerHTML='';
}

}


//Get table data according to pagination
async function getPaginationData(pageNumber, filename){
  
  const si = ((pageNumber-1)*100);
  const ei = (pageNumber * 100);
  try{
    const response = await fetch(`/csv/get/${filename}`, {
        method: 'GET',
    });
    const csvData = await response.text();
    // console.log(csvData);
      // Use PapaParse to parse CSV data
      Papa.parse(csvData, {
        header: true, // Treat the first row as headers
        dynamicTyping: true, // Automatically detect and convert numeric values
        complete: function (results) {
            // console.log(results.data);
          const totalRecords = results.data.length;
          // createDataPage(results.data.slice(si, ei), totalRecords, si, ei, filename);
          createPageHeader(totalRecords,si, ei);
          createTable(results.data.slice(si, ei));
          console.log(results.data.slice(si, ei));
        },
        error: function (error) {
            console.error('Error:', error.message);
        },
    });

}catch (error) {
    console.error('Error:', error.message);
}

}

//addlistener to search bar 
function addListenerToSearchBar(data){
  const columnName = Object.keys(data[0]);
  searchBarContainer.style.display = 'flex';
            //Add search event listener
      searchBar.addEventListener('submit' , (event)=>{
          event.preventDefault();
          const searchInput = document.getElementById('search-input').value.trim();
          if(searchInput != ''){
            searchRows(data, columnName[0], currentFilename);
          }
          // console.log("inside searchbar event")
            
        })

      searchBar.addEventListener('input', (event)=>{
        event.preventDefault();
        console.log("EMpty input called")
        const searchInput = document.getElementById('search-input').value.trim();
        if(searchInput === ''){
          console.log("inside empty if")
          createDataPage(currentFullData.slice(0, 100), currentFullData.length, 0, 100, currentFilename);
        }
      })
}


//filter searched value
function searchRows(data, columnName, filename){
  const searchInput = document.getElementById('search-input').value.trim();
  console.log(searchInput);
  const filteredData = data.filter((item) => item[columnName].toString().toLowerCase() === searchInput.toString().toLowerCase());
  const totalRecords = (filteredData.length);
  console.log(filteredData)

  if(filteredData.length > 0){
    const si = 0;
  const ei = data.length>100 ? 100 : data.length
  createDataPage(filteredData, totalRecords, si, ei, filename);
  }else{
    const totalRows = document.getElementById('total-rows');
    totalRows.innerHTML = '';

    const currentRows = document.getElementById('current-rows');
    currentRows.innerHTML = '';

    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';

    const paginationContainer = document.getElementById('data-pagination-container');     
    paginationContainer.innerHTML ='';
  }
  
}