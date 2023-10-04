type logType = "ERROR" | "INFO" | "WARNING" | "SUCCESS";

class Logger {
  private colors: { [key: string]: string } = {
    error: "\x1b[31m", // Red
    info: "\x1b[36m", // Cyan
    warning: "\x1b[33m", // Yellow
    success: "\x1b[32m", // Green
  };

  private resetColor = "\x1b[0m";

  log(type: logType, message: string, data?: object): void {
    const formattedMessage = this.formatMessage(type, message, data);
    console.log(formattedMessage);
  }

  error(message: string, data?: object): void {
    this.log("ERROR", message, data);
  }

  info(message: string, data?: object): void {
    this.log("INFO", message, data);
  }

  warning(message: string, data?: object): void {
    this.log("WARNING", message, data);
  }

  success(message: string, data?: object): void {
    this.log("SUCCESS", message, data);
  }

  private formatMessage(type: logType, message: string, data?: object): string {
    const color = this.colors[type.toLowerCase()] || "";
    const logType = type.toUpperCase();
    const formattedData = data ? `\n${JSON.stringify(data, null, 2)}` : "";

    return `${color}[${logType}] ${message}${formattedData}${this.resetColor}`;
  }
}

// Example usage:
export default new Logger();
