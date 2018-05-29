export default class {
  constructor (from, to) {
    this.from = from
    this.to = to
    this.delta = to - from
  }
  spin () {
    return [
      this.randomNum(),
      this.randomNum(),
      this.randomNum()
    ]
  }
  randomNum () {
    return this.from + Math.round(Math.random() * (this.delta))
  }
}
