import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';

// Define GraphQL schema
const typeDefs = gql`
  type WebPageMetadata {
    URL: String!
    CrawlDate: String!
    PageTitle: String
    WordCount: Int
    ContentType: String
    MetaDescription: String
  }

  type Query {
    getWebPageMetadataByUrl(URL: String!): [WebPageMetadata]
    getWebPageMetadataByDateRange(
      startDate: String!
      endDate: String!
    ): [WebPageMetadata]
    getWebPageMetadataByTitle(
      URL: String!
      PageTitle: String!
    ): [WebPageMetadata]
  }

  type Mutation {
    addWebPageMetadata(
      URL: String!
      CrawlDate: String!
      PageTitle: String
      WordCount: Int
      ContentType: String
      MetaDescription: String
    ): WebPageMetadata
  }
`;

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

// Define resolvers
const resolvers = {
  Query: {
    getWebPageMetadataByUrl: async (_: unknown, { URL }: { URL: string }) => {
      const params = {
        TableName: 'WebPageMetadata',
        KeyConditionExpression: 'URL = :url',
        ExpressionAttributeValues: {
          ':url': { S: URL },
        },
      };

      try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        return (
          data.Items?.map((item) => ({
            URL: item.URL.S,
            CrawlDate: item.CrawlDate.S,
            PageTitle: item.PageTitle.S,
            WordCount: parseInt(item.WordCount.N),
            ContentType: item.ContentType.S,
            MetaDescription: item.MetaDescription.S,
          })) || []
        );
      } catch (err) {
        console.error('Error querying data by URL:', err);
        return [];
      }
    },
    getWebPageMetadataByDateRange: async (
      _: any,
      { startDate, endDate }: { startDate: string; endDate: string },
    ) => {
      const params = {
        TableName: 'WebPageMetadata',
        IndexName: 'GSI1',
        KeyConditionExpression: 'CrawlDate BETWEEN :start_date AND :end_date',
        ExpressionAttributeValues: {
          ':start_date': { S: startDate },
          ':end_date': { S: endDate },
        },
      };

      try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        return (
          data.Items?.map((item) => ({
            URL: item.URL.S,
            CrawlDate: item.CrawlDate.S,
            PageTitle: item.PageTitle.S,
            WordCount: parseInt(item.WordCount.N),
            ContentType: item.ContentType.S,
            MetaDescription: item.MetaDescription.S,
          })) || []
        );
      } catch (err) {
        console.error('Error querying data by date range:', err);
        return [];
      }
    },
    getWebPageMetadataByTitle: async (
      _: unknown,
      { URL, PageTitle }: { URL: string; PageTitle: string },
    ) => {
      const params = {
        TableName: 'WebPageMetadata',
        IndexName: 'LSI1',
        KeyConditionExpression: 'URL = :url AND PageTitle = :title',
        ExpressionAttributeValues: {
          ':url': { S: URL },
          ':title': { S: PageTitle },
        },
      };

      try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        return (
          data.Items?.map((item) => ({
            URL: item.URL.S,
            CrawlDate: item.CrawlDate.S,
            PageTitle: item.PageTitle.S,
            WordCount: parseInt(item.WordCount.N),
            ContentType: item.ContentType.S,
            MetaDescription: item.MetaDescription.S,
          })) || []
        );
      } catch (err) {
        console.error('Error querying data by title:', err);
        return [];
      }
    },
  },
  Mutation: {
    addWebPageMetadata: async (
      _: unknown,
      {
        URL,
        CrawlDate,
        PageTitle,
        WordCount,
        ContentType,
        MetaDescription,
      }: {
        URL: string;
        CrawlDate: string;
        PageTitle: string;
        WordCount: number;
        ContentType: string;
        MetaDescription: string;
      },
    ) => {
      const params = {
        TableName: 'WebPageMetadata',
        Item: {
          URL: { S: URL },
          CrawlDate: { S: CrawlDate },
          PageTitle: { S: PageTitle },
          WordCount: { N: WordCount.toString() },
          ContentType: { S: ContentType },
          MetaDescription: { S: MetaDescription },
        },
      };

      try {
        await dynamoDBClient.send(new PutItemCommand(params));
        return {
          URL,
          CrawlDate,
          PageTitle,
          WordCount,
          ContentType,
          MetaDescription,
        };
      } catch (err) {
        console.error('Error inserting data:', err);
        throw new Error('Failed to insert data');
      }
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`Server ready at ${url}`);
};

startServer();
