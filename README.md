# Serverless POC

This project demonstrates a Proof of Concept (POC) for a serverless application using Node.js.

## Prerequisites

- Node.js (v14 or later)
- Serverless Framework
- AWS CLI configured with appropriate permissions

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/serverless-poc.git
    cd serverless-poc
    ```

2. Install dependencies:
    ```sh
    npm install
    ```
3. Install dependencies:
    ```sh
    npm run dev
    ```

## Deployment

To deploy the serverless application, run:
```sh
serverless deploy
```

## Usage

After deployment, you can invoke the functions using the Serverless Framework:
```sh
serverless invoke -f functionName
```

## Project Structure

- `handler.js`: Contains the Lambda function handlers.
- `serverless.yml`: Configuration file for the Serverless Framework.
- `package.json`: Node.js project configuration file.

## License

This project is licensed under the MIT License.
