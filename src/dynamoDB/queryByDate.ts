import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

const queryByDate = async (): Promise<unknown> => {
  const params = {
    TableName: 'WebPageMetadata',
    IndexName: 'GSI1',
    KeyConditionExpression: 'CrawlDate = :date',
    ExpressionAttributeValues: {
      ':date': { S: '2024-06-13T10:00:00Z' },
    },
  };

  try {
    const data = await client.send(new QueryCommand(params));
    console.log('Query succeeded:', data.Items);
    return data.Items;
  } catch (err) {
    console.error('Error querying data:', err);
  }

  return null; // Add a return statement here to handle the case when an error occurs.
};

queryByDate();
