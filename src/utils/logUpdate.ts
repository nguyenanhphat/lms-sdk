import ansiEscapes from 'ansi-escapes';
import wrapAnsi from 'wrap-ansi';

const originalWrite = Symbol('webpackbarWrite');

export class LogUpdate {

  get columns() {
    return (process.stderr.columns || 80) - 2;
  }
  extraLines = '';
  listening = false;
  prevLineCount = 0;
  streams = [process.stdout, process.stderr];

  constructor() {
    this._onData = this._onData.bind(this);
  }

  _onData(data) {
    const str = String(data);
    const lines = str.split('\n').length - 1;
    if (lines > 0) {
      this.prevLineCount += lines;
      this.extraLines += data;
    }
  }

  clear() {
    this.done();
    this.write(ansiEscapes.eraseLines(this.prevLineCount));
  }

  done() {
    this.stopListen();

    this.prevLineCount = 0;
    this.extraLines = '';
  }

  listen() {
    if (this.listening) {
      return;
    }

    for (const stream of this.streams) {
      if (stream.write[originalWrite]) {
        continue;
      }

      const write = (data, ...args) => {
        if (!stream.write[originalWrite]) {
          return stream.write(data, ...args);
        }
        this._onData(data);
        return stream.write[originalWrite].call(stream, data, ...args);
      };

      write[originalWrite] = stream.write;

      stream.write = write;
    }

    this.listening = true;
  }

  render(lines) {
    this.listen();

    const wrappedLines = wrapAnsi(lines, this.columns, {
      trim: false,
      hard: true,
      wordWrap: false,
    });

    const data =
      ansiEscapes.eraseLines(this.prevLineCount) +
      wrappedLines +
      '\n' +
      this.extraLines;

    this.write(data);

    this.prevLineCount = data.split('\n').length;
  }

  stopListen() {
    for (const stream of this.streams) {
      if (stream.write[originalWrite]) {
        stream.write = stream.write[originalWrite];
      }
    }

    this.listening = false;
  }

  write(data) {
    const stream = process.stderr;
    if (stream.write[originalWrite]) {
      stream.write[originalWrite].call(stream, data, 'utf-8');
    } else {
      stream.write(data, 'utf-8');
    }
  }
}
