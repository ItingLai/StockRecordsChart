export interface StatisticsTable {//StockOrdertype
    "Ticker": string,
    "Date": string,
    "OpenVolume": number,
    "VolumeThreshold": number,
    "OpenPrice": number,
    "ClosePrice": number,
    "Price": number,
    "Side": string,
    "Profit": null|number,
}
export interface RecordsTable {//StockOrdertype
    "orderType": string,
    "datetime": string,
    "symbol": string,
    "size": number,
    "price": number,
    "amount": number,
    "side": string,
    "total": number,
    "closePosition": boolean,
    "totalIncome": number,
    "totalIncomeRate": number
}
export interface IncomeTable {//StockOrdertype
    "datetime": string,
    "symbol": string,
    "size": number,
    "price": number,
    "amount": number,
    "side": string,
    "total": number,
    "totalIncome": number,
    "totalIncomeRate": number
}
export interface StockPriceRecordData {
    "datetime": string,
    "open": number,
    "high": number,
    "low": number,
    "close": number,
    "volume": number,
    "order_type": string,
    "side": string,
    "open_price": number,
    "cost": number,
    "from_position": string,
    "profit": number,
    "return_rate": number,
    "size": number,
}
export interface StockPriceData {
    "datetime": string,
    "open": number,
    "high": number,
    "low": number,
    "close": number,
    "volume": number,
}
export interface StockRecordsData {
    "datetime": string,
    "order_type": string,
    "side": string,
    "price": number,
    "cost": number,
    "from_position": string,
    "profit": number,
    "return_rate": number,
    "size": number,
}
export interface StockResultData {
    "ticker": string,
    "initial_balance": number,
    "total_profits": number,
    "win_rate": number,
    "total_return_rate": number,
    "total_trading": number,
    "avg_positive": number,
    "avg_negative": number,
    "odds": number,
    "expected_value": number,
    "max_loss": number,
    "mdd": number,
    "mdd_percentage": number,
    "mar": number,
    "sqn": number,
}
export interface StockDataKey<T> {
    [key:string]:T
}