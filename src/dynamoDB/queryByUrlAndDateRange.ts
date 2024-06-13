import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

const queryByUrlAndDateRange = async (): Promise<unknown[]> => {
  const params = {
    TableName: 'WebPageMetadata',
    KeyConditionExpression:
      'URL = :url AND CrawlDate BETWEEN :start_date AND :end_date',
    ExpressionAttributeValues: {
      ':url': { S: 'https://example.com' },
      ':start_date': { S: '2024-06-01T00:00:00Z' },
      ':end_date': { S: '2024-06-30T23:59:59Z' },
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

queryByUrlAndDateRange();
