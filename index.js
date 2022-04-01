const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

//gazeteleri buraya eklersin
const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/specials/world/cnn-climate',
        base: ''
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }

]
//gazete listesi üzerinde çalışan döngü 
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {

                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,//if have a base
                    source: newspaper.name
                })
            })

        })
})
//ana sayfada verilecek tepki

app.get('/', (req, res) => {
    res.json('Welcome To My Climate change news api')
})
//news sayfası get methodu

app.get('/news', (req, res) => {


    res.json(articles)

})
//belirli bir gazte adına air get methodu-
app.get('/news/:newspaperId', (req, res) => {

    const newspaperId = req.params.newspaperId
    const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address//gets the adress of newspapeer object

    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base//gets the base

    axios.get(newspaperAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const spesificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                spesificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })

            })
            res.json(spesificArticles)

        }).catch(err => console.log(err))
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

