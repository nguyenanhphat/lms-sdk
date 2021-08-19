const handleError = (error: Error, message?: string) => {
  if (message) {
    console.error(message);
  }
  console.error(error);
  process.exit(1);
};

export function parse(data: string, silent: boolean = true) {
  let result;

  try {
    result = JSON.parse(data);
  } catch (error) {
    if (!silent) {
      handleError(error);
    }
  }

  return result;
}
