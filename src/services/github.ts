interface GitHubIssue {
    number: number;
    title: string;
    body: string;
    state: string;
    created_at: string;
    html_url: string;
}

export const fetchGitHubIssues = async (token: string, owner: string, repo: string): Promise<GitHubIssue[]> => {
    if (!token || !owner || !repo) {
        throw new Error('Missing GitHub credentials');
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open`, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid GitHub token');
        }
        if (response.status === 404) {
            throw new Error('Repository not found');
        }
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
};
