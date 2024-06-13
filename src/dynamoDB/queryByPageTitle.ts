import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

const queryByPageTitle = async (): Promise<unknown[]> => {
  const params = {
    TableName: 'WebPageMetadata',
    IndexName: 'LSI1',
    KeyConditionExpression: 'URL = :url AND PageTitle = :title',
    ExpressionAttributeValues: {
      ':url': { S: 'https://example.com' },
      ':title': { S: 'Example Page' },
    },
  };

  try {
    const data = await client.send(new QueryCommand(params));
    console.log('Query succeeded:', data.Items);
    return data.Items;
  } catch (err) {
    console.error('Error querying data:', err);
    throw err; // Add a throw statement to propagate the error
  }
};

queryByPageTitle();
