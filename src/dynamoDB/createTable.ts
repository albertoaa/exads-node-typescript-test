import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

const createTable = async () => {
  const params = {
    TableName: 'WebPageMetadata',
    KeySchema: [
      { AttributeName: 'URL', KeyType: 'HASH' }, // Partition key
      { AttributeName: 'CrawlDate', KeyType: 'RANGE' }, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: 'URL', AttributeType: 'S' },
      { AttributeName: 'CrawlDate', AttributeType: 'S' },
      { AttributeName: 'PageTitle', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'CrawlDate', KeyType: 'HASH' }, // Partition key
          { AttributeName: 'URL', KeyType: 'RANGE' }, // Sort key
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    LocalSecondaryIndexes: [
      {
        IndexName: 'LSI1',
        KeySchema: [
          { AttributeName: 'URL', KeyType: 'HASH' }, // Partition key
          { AttributeName: 'PageTitle', KeyType: 'RANGE' }, // Sort key
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
    ],
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('Table created:', data);
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

createTable();
