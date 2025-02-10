const axios = require('axios')

const SYMBOL = 'BTCUSDT'
const BUY_PRICE = 97450

const API_URL_BINANCE = 'https://testnet.binance.vision'
// const API_URL_BINANCE = 'https://api.binance.com' PRD

let initBot = true
let isOpened = false
let lastPrice = 0

const PERCENT_TRADE = 0.05 * 100

let COUNT_BUY = 0
let COUNT_SELL = 0

async function start() {
    const { data } = await axios.get(API_URL_BINANCE + '/api/v3/klines?limit=21&interval=15m&symbol=' + SYMBOL)
    const candle = data[data.length - 1]
    const price = parseFloat(candle[4])

    console.clear()
    console.log('Valor de mercado: $'+ price)
    console.log('Último valor negociado: $' + lastPrice)

    if(initBot) {
        console.log('Analisando primeira compra...')

        if(price <= BUY_PRICE) {
            console.log('Primeira compra concluida...')

            initBot = false
            isOpened = true
            lastPrice = price
            COUNT_BUY = COUNT_BUY + 1
        }
    } else {
        const priceToBuy = lastPrice - PERCENT_TRADE
        const priceToSell = lastPrice + PERCENT_TRADE

        console.log('Quantidade de compras realizadas: ' + COUNT_BUY)
        console.log('Quantidade de vendas realizadas: ' + COUNT_SELL)

        console.log('\n')

        console.log('Melhor valor calculado para compra: $' + priceToBuy)
        console.log('Melhor valor calculado para venda: $' + priceToSell)

        if(price <= priceToBuy && isOpened === false) {
            console.log('Comprando...')

            isOpened = true
            lastPrice = price
            COUNT_BUY = COUNT_BUY + 1
        } else if(price >= priceToSell && isOpened === true) {
            console.log('Vendendo...')

            isOpened = false
            COUNT_SELL = COUNT_SELL + 1
        } else {
            console.log('Baseado nos calculos, melhor aguardar...')
        }
    }
}

start()
setInterval(start, 3000)