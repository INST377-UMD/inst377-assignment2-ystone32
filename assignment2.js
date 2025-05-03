const api_url ="https://zenquotes.io/api/quotes/";

async function getapi(url)
{
  const response = await fetch(url);
  const data = await response.json();
  const quote = data[0].q;
  const author = data[0].a;
  document.getElementById("rand_qout").innerText = `"${quote}" — ${author}`;
}

getapi(api_url);


function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
let charts = null;
function stockSubmission() {
    event.preventDefault();

    const stock = document.getElementById("stock_opt").value.toUpperCase();
    const days = parseInt(document.getElementById("days_opt").value);
    const today = new Date();
    const upper_day = new Date(today);
    upper_day.setDate(upper_day.getDate() - 1);
    const upper_date =  formatDate(upper_day);
    const lower_day = new Date(upper_day); 
    lower_day.setDate(lower_day.getDate() - days); 
    const lower_date = formatDate(lower_day);

    const url = `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${lower_date}/${upper_date}?sort=asc&apiKey=qTNAGSrcV_VpZnvrplLbiKX4PCayZlyl`;
    const y_values = []
    const x_values = []

    fetch(url)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.results.length; i++) {
            y_values.push(data.results[i].c); 
          }
          for (let i = 0; i < data.results.length; i++) {
            const myDate = new Date( data.results[i].t * 1000);
            x_values.push(myDate.toLocaleString())
        }

        console.log("Close prices:", y_values);
        console.log("Timestamps:", x_values);
        
        if (charts) {
            charts.destroy();
          }


        const chart_values = {
            labels: x_values,
            datasets: [{
              label: '($) Stock Price',
              data: y_values,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          };
          const config = {
            type: 'line',
            data: chart_values,
          };
        
        const ctx = document.getElementById('StockLineChart').getContext('2d');
        charts = new Chart(ctx, config);
        document.getElementById("StockLineChart").style.display = "block";
        
      });
  
}

function getBulls() {
    const trades = "https://tradestie.com/api/v1/apps/reddit?date=2022-04-03";
    const bullTable = document.getElementById("bullTable");
    fetch(trades)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (let i = 0; i < 5; i++) {
                const tableRow = document.createElement("tr");
                const tickerValue = document.createElement("td");
                const tickerLink = document.createElement("a");
                const comments = document.createElement("td");
                const sentiment =  document.createElement("td");
            
                tickerLink.href = `https://finance.yahoo.com/quote/${data[i].ticker}`; 
                tickerLink.target = "_blank";
                tickerLink.innerHTML = data[i].ticker;
                tickerValue.appendChild(tickerLink);
                comments.innerHTML = data[i].no_of_comments;

                if (data[i].sentiment == "Bullish") {
                    const img = document.createElement("img");
                    img.src = "https://bsmedia.business-standard.com/_media/bs/img/article/2024-09/20/full/1726823229-1365.jpg?im=FeatureCrop,size=(826,465)";
                    img.style.width = "50px"; 
                    img.style.height = "50px";
                    sentiment.appendChild(img);
                } else {
                    const img = document.createElement("img");
                    img.src = "https://southfloridareporter.com/wp-content/uploads/2025/04/global-economy-crisis-bearish-stock-market-crash-concept-with-falling-down-digital-red-financial-chart-candlestick-bear-symbol-dark-background-3d-rendering.jpg";
                    img.style.width = "50px";  
                    img.style.height = "50px";
                    sentiment.appendChild(img);
                }
                

            
                tableRow.appendChild(tickerValue);
                tableRow.appendChild(comments);
                tableRow.appendChild(sentiment);
            
                bullTable.appendChild(tableRow);
              }

        });
}
function dogCarousel() {
  const dogs = "https://dog.ceo/api/breeds/image/random/10";
  const randDogs = document.getElementById("randDogs");

  fetch(dogs)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      data.message.forEach(dogUrl => {
        const dogImage = document.createElement("img");
        dogImage.src = dogUrl;
        dogImage.style.width = "100%"; 
        dogImage.style.height = "100%";
        randDogs.appendChild(dogImage);
      });

      simpleslider.getSlider({
        container: randDogs,
        transitionTime:1,
        delay:3.5
      });
    });
}
function dogButtons() {
  const dog_info = "https://dogapi.dog/api/v2/breeds?page[number]=1";

  fetch(dog_info)
    .then(response => response.json())
    .then(data => {
      const breeds = data.data;
      const dog_butts = document.getElementById("dog_butts");

      breeds.forEach((breed, index) => {
        const dog_but = document.createElement("button");
        dog_but.id = `dog_${index + 1}`;
        dog_but.name = breed.attributes.name;
        dog_but.className = "button-85";
        dog_but.textContent = breed.attributes.name;
        dog_but.onclick = () => showBreedInfo(breed.id); 
        dog_butts.appendChild(dog_but);
      });
    });
}

function showBreedInfo(dog_id) {
  const dog_info = `https://dogapi.dog/api/v2/breeds/${dog_id}`;
  
  fetch(dog_info)
    .then(response => response.json())
    .then(data => {
      const dog_facts = document.getElementById("dog_Facts");
      dog_facts.style.backgroundColor = "white";
      dog_facts.style.border = "4px solid black";
      dog_facts.style.paddingLeft = "5px";
      dog_facts.innerHTML = "";


      const breed = data.data;

      const dog_name = document.createElement("h1");
      dog_name.textContent = `Name: ${breed.attributes.name}`;

      const dog_descr = document.createElement("h2");
      dog_descr.textContent = `Description: ${breed.attributes.description}`;

      const dog_life_min = document.createElement("h3");
      dog_life_min.textContent = `Min Life: ${breed.attributes.life?.min ?? "N/A"}`;
      
      const dog_life_max = document.createElement("h3");
      dog_life_max.textContent = `Max Life: ${breed.attributes.life?.max ?? "N/A"}`;

      dog_facts.appendChild(dog_name);
      dog_facts.appendChild(dog_descr);
      dog_facts.appendChild(dog_life_min);
      dog_facts.appendChild(dog_life_max);
    });
}

function audio_on() {
  if (annyang) {
    // Let's define commands.
    const commands = {
      'hello': () => { alert('Hello world!'); },
      
      'navigate to stocks page': () => {
        location.href = "stocks_page.html";
      },
      'navigate to home page': () => {
        location.href = "home_page.html";
      },
      
      'navigate to dogs page': () => {
        location.href = "dog_page.html";
      },

      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      
      'load *breed': (breed) => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
        if (button.innerText.trim().toLowerCase() === breed.trim().toLowerCase()) {
        button.click();
          }
        });
      },
      'lookup *stock': (stock) => {
        document.getElementById('stock_opt').value = stock.toUpperCase();
        document.getElementById('days_opt').value = 30;
        stockSubmission();
      },

    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening
    annyang.start();
  }
}


function theCall(){
  dogButtons();
  dogCarousel();
  getBulls();
}
window.onload = theCall;