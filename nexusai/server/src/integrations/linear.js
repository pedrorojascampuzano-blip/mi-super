// Linear integration - GraphQL API
const ENDPOINT = 'https://api.linear.app/graphql';

async function linearQuery(credentials, query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: credentials.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Linear API error ${res.status}`);
  }
  const data = await res.json();
  if (data.errors) {
    throw new Error(`Linear GraphQL: ${data.errors[0]?.message}`);
  }
  return data.data;
}

export default {
  name: 'linear',
  requiredCredentials: ['api_key'],

  async validate(credentials) {
    try {
      const data = await linearQuery(credentials, '{ viewer { id } }');
      return !!data?.viewer?.id;
    } catch {
      return false;
    }
  },

  async sync(credentials, lastSyncAt) {
    const items = [];
    const errors = [];

    try {
      const query = `
        query Issues($filter: IssueFilter) {
          issues(filter: $filter, first: 100, orderBy: updatedAt) {
            nodes {
              id
              identifier
              title
              description
              url
              priority
              updatedAt
              state { name type }
              assignee { name email }
              project { name }
              team { key }
            }
          }
        }
      `;

      const variables = lastSyncAt
        ? { filter: { updatedAt: { gte: lastSyncAt } } }
        : { filter: {} };

      const data = await linearQuery(credentials, query, variables);

      for (const issue of data.issues?.nodes || []) {
        items.push({
          source: 'linear',
          source_id: issue.id,
          item_type: 'task',
          title: `[${issue.identifier}] ${issue.title}`,
          body: issue.description || null,
          metadata: {
            status: issue.state?.name,
            state_type: issue.state?.type,
            priority: issue.priority,
            assignee: issue.assignee?.name,
            assignee_email: issue.assignee?.email,
            project: issue.project?.name,
            team: issue.team?.key,
            url: issue.url,
            identifier: issue.identifier,
          },
          source_timestamp: issue.updatedAt,
        });
      }
    } catch (err) {
      errors.push(`linear sync: ${err.message}`);
    }

    return { items, errors };
  },

  actions: {
    async search(credentials, { query }) {
      const data = await linearQuery(credentials, `
        query Search($q: String!) {
          issueSearch(query: $q, first: 20) {
            nodes { id identifier title url }
          }
        }
      `, { q: query });
      return data.issueSearch?.nodes || [];
    },

    async updateStatus(credentials, { source_id, status }) {
      // First find the state ID for the requested status name
      const data = await linearQuery(credentials, `
        query States { workflowStates { nodes { id name } } }
      `);
      const state = data.workflowStates?.nodes?.find(
        s => s.name.toLowerCase() === status.toLowerCase()
      );
      if (!state) throw new Error(`Unknown Linear status: ${status}`);

      return linearQuery(credentials, `
        mutation UpdateIssue($id: String!, $stateId: String!) {
          issueUpdate(id: $id, input: { stateId: $stateId }) {
            success
            issue { id state { name } }
          }
        }
      `, { id: source_id, stateId: state.id });
    },
  },
};
