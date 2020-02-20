import Cities from "../js/city.js"

'use strict';
document.addEventListener('DOMContentLoaded', function() {
        console.log("DOMContentLoaded")
        const MS = 1000
        const MIN = 60;
        let id = 0;
        const K = 273.15;

        /* search by name returns a result set since country names are only uniqe in a country
         * location name:
         *  <string> - <iso code>
         *  e.g: London - GB
         */
        function Search(name) {
            const result = new Map();
            const fqcn = name.split('-');
            const cty = fqcn[0].trim();
            const ctr = typeof fqcn[1] !== 'undefined' ? fqcn[1].trim() : undefined

            Cities.forEach(function(city) {
                if (city.name.toLowerCase() === cty.toLowerCase()) {
                    if (typeof ctr !== 'undefined') { // ctr is set in the sesrch
                        if (ctr === city.country) {
                            result.set(city.name + ' - ' + city.country, city.id)
                        }
                    } else
                        result.set(city.name + ' - ' + city.country, city.id)
                }
            });
            return result
        }
        /* wait for input */
        var timeout = null;
        document.getElementById('search-text').addEventListener('keyup', function() {
            var that = this
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            var timeout = setTimeout(function() {
                    console.log("timeout")
                    let resultSet = Search($(that).val())
                    if (resultSet.size === 1) {
                        const id = (<HTMLInputElement>resultSet.values().next()).value;
                        console.log(id)
                        main(id);
                    }
                    let tmp = '<datalist id="location-list">'
                    resultSet.forEach(function(item, index) {
                        tmp += `<option value = "${index}">${item}</option>`
                    })
                    tmp += '</datalist>';
                    const _result_ = document.getElementById("result")

                    _result_.innerHTML = tmp
                },
                1000);
        });

        /* start and pick wht is requested on the screen */
        function main(data:String) {
            var _search_text_ = (<HTMLInputElement>document.getElementById("search-text"));
            const _sky_ = document.getElementById("sky");
            _sky_.innerHTML = "";

            const resultSet = Search((<HTMLInputElement>_search_text_).value)

            fetchData("http://api.openweathermap.org/data/2.5/forecast?id=" + data);
        }

        /*
         * Convert kelvin into Celsius
         */
        function ToC(x) {
            return (x - K).toFixed(0);
        }

        /*
         * This derives the icon to be shown for the specific waether
         */
        function summary(item) {
            let result = "png/008-weather.png";
            console.log("summary");
            console.log(item);

            if (item.main.temp_min < 273) {
                result = "png/046-cold.png"
            } else {
                result = item.weather[0].main == "Rain" ? "png/002-rain.png" : result;
                result = item.weather[0].description == "broken clouds" ? "png/020-clouds.png" : result;
                result = item.weather[0].description == "few clouds" ? "png/015-cloud.png" : result;
                result = item.weather[0].description == "overcast clouds" ? "png/013-cloudy.png" : result;
                result = item.weather[0].description == "clear sky" ? "png/013-cloudy.png" : result;
            }
            return "./img/icons/" + result;
        }

        function appendRow(str, row) {
            let result = str

            result += `<div class="row text-center"> `
            for (let i = 0; i < row.length; ++i) {
                result += `<div class="col-sm-4 text-center"> ${row[i]} </div>`;
            }
            return result += `</div><hr class="style5">`; // end of row
        }

        /* a small wraper to inser the summry image */
        function summaryImage(item, cls) {
            let result = `<img class="${cls} block-center" src=${summary(item)}>`;

            console.log(result);
            return result;
        }

        // do the per page rendering of the received data
        function ProcessAndRender(data) {
            console.log("ProcessAndRender");
            console.log(data);
            let todays = data.list[0].weather[0].description;
            const _sky_ = document.getElementById("sky");

            if (data.cod != 200) {
                alert(data.message);
            }

            // create forecast overview
            let table = `<div class="container">`;

            /* running throught the  complete weather prediction */
            data.list.forEach(function(item) {
                console.log(item.dt_txt) // e.g: 2019-05-07 15:00:0
                const date = item.dt_txt.split(' ')[0]
                const time = item.dt_txt.split(' ')[1]

                table = appendRow(table, [`${ToC(item.main.temp)}`,
                    `${date} ${time}`,
                    `${summaryImage(item, "summaryIcons")}`
                ]);

            }); // end forEach list item

            let info = `<div class="card">
                    <div class="card-header lead"><h1>${data.city.name} / ${data.city.country}</h1></div>
                      ${summaryImage(data.list[0], "dailySummary")}
                        <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item lead"> ${data.list[0].weather[0].description}</li>
                            <li class="list-group-item lead">Temperature ${ToC( data.list[0].main.temp_min)} C</li>
                        </ul>
                       ${table}
                        </div>
                    </div>`

            _sky_.innerHTML += info;
        } /* ProcessAndRender */

        // fetches data from the  server
        // TODO: this key needs to be replaced to make it working in the netlify environment
        function fetchData(url) {
            const key = "6f88b36c3ba927bbc4676605fc738ae3";
            const myurl = url + "&appid=" + key;
            console.log(myurl);
            console.log("fetching" + myurl);
            fetch(url + "&appid=" + key)
                .then(function(response) {
                    return response.json()
                })
                .then(function(myJson) {
                    ProcessAndRender(myJson);
                })
                .catch(err => console.log(err))
        }

        main("");
    }) // DOMContentLoaded handler
