import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

const insertData = async (): Promise<PutItemCommandOutput> => {
  const params = {
    TableName: 'WebPageMetadata',
    Item: {
      URL: { S: 'https://example.com' },
      CrawlDate: { S: '2024-06-13T10:00:00Z' },
      PageTitle: { S: 'Example Page' },
      WordCount: { N: '500' },
      ContentType: { S: 'text/html' },
      MetaDescription: { S: 'An example web page' },
    },
  };

  try {
    const data = await client.send(new PutItemCommand(params));
    console.log('Data inserted:', data);
    return data;
  } catch (err) {
    console.error('Error inserting data:', err);
    throw err; // Add this line to rethrow the error
  }
};

insertData();
