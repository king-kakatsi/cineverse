# Contributing to CineVerse

Thank you for your interest in contributing to CineVerse! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

### Our Standards

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating a bug report:

1. Check existing issues to avoid duplicates
2. Collect relevant information about the bug
3. Try to reproduce the issue in a clean environment

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari]
- Node version: [e.g. 18.0.0]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

### Suggesting Features

Feature suggestions are welcome! Please:

1. Check if the feature has already been suggested
2. Clearly describe the feature and its benefits
3. Provide use cases and examples
4. Consider implementation complexity

**Feature Request Template:**

```markdown
**Is your feature related to a problem?**
A clear description of the problem.

**Describe the solution**
A clear description of what you want to happen.

**Describe alternatives**
Alternative solutions you've considered.

**Additional context**
Any mockups, examples, or relevant information.
```

### Submitting Changes

#### Development Workflow

1. **Fork the repository**

```bash
# Click "Fork" on GitHub, then clone your fork
git clone git@github.com:EpitechCodingAcademyPromo2026/C-COD-270-COT-2-1-c2cod270p0-7.git
cd cineverse
```

2. **Create a branch**

```bash
# Create and checkout a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

3. **Setup development environment**

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

4. **Make your changes**

- Write clean, readable code
- Follow existing code style
- Add comments where necessary
- Update documentation if needed

5. **Test your changes**

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Test the application
npm run dev
```

6. **Commit your changes**

Follow conventional commit format:

```bash
git add .
git commit -m "feat: add movie rating feature"
```

7. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

8. **Create Pull Request**

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill out the PR template
- Submit for review

## Development Guidelines

### Code Style

#### JavaScript/JSX

```javascript
// Use descriptive variable names
const userMoviesList = getUserMovies(userId);

// Use arrow functions for callbacks
movies.map(movie => ({
  id: movie.id,
  title: movie.title
}));

// Use async/await instead of promises
async function fetchMovie(id) {
  try {
    const movie = await getMovieById(id);
    return movie;
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
}

// Destructure props in components
export default function MovieCard({ title, poster, rating }) {
  return (
    <div className="movie-card">
      <img src={poster} alt={title} />
      <h3>{title}</h3>
      <span>{rating}</span>
    </div>
  );
}
```

#### Component Structure

```javascript
// 1. Imports
import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';

// 2. Component definition
export default function MovieList({ userId }) {
  // 3. State declarations
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 4. Effects
  useEffect(() => {
    fetchMovies();
  }, [userId]);
  
  // 5. Event handlers
  const handleMovieClick = (movieId) => {
    // Handle click
  };
  
  // 6. Helper functions
  const fetchMovies = async () => {
    // Fetch logic
  };
  
  // 7. Conditional rendering checks
  if (loading) return <LoadingSpinner />;
  if (!movies.length) return <EmptyState />;
  
  // 8. Main render
  return (
    <div className="movie-list">
      {movies.map(movie => (
        <MovieCard 
          key={movie.id} 
          {...movie} 
          onClick={handleMovieClick}
        />
      ))}
    </div>
  );
}
```

#### API Route Structure

```javascript
// app/api/movies/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAllMovies } from '@/lib/movies';

export async function GET(request) {
  try {
    // 1. Authentication check
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 2. Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    
    // 3. Fetch data
    const movies = await getAllMovies({ page });
    
    // 4. Return response
    return NextResponse.json({
      success: true,
      movies
    });
    
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Naming Conventions

**Files and Folders:**
```
components/
  MovieCard.jsx          # PascalCase for components
  movieUtils.js          # camelCase for utilities

app/
  movies/[id]/page.jsx   # lowercase for routes
  
lib/
  prisma.js              # lowercase for libraries
  
services/
  movieService.js        # camelCase for services
```

**Variables and Functions:**
```javascript
// camelCase for variables and functions
const moviesList = [];
const userProfile = {};

function fetchMovieData() {}
async function getUserById(id) {}

// PascalCase for components and classes
function MovieCard() {}
class MovieService {}

// UPPER_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;
```

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes
- `build:` - Build system changes

**Examples:**

```bash
feat(movies): add movie rating system
fix(auth): resolve login redirect issue
docs(api): update authentication documentation
refactor(components): simplify MovieCard component
perf(database): optimize movie queries with indexing
```

**Detailed commit:**

```
feat(wishlist): add remove all functionality

Add a button to remove all movies from wishlist at once.
Includes confirmation modal to prevent accidental deletion.

Closes #123
```

### Pull Request Guidelines

**PR Title:**
Follow the same format as commit messages:
```
feat(movies): add advanced filtering options
```

**PR Description Template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests passing

## Screenshots
If applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tested on multiple browsers

## Related Issues
Closes #<issue_number>
```

### Testing Guidelines

#### Manual Testing

Before submitting a PR:

1. Test the feature/fix thoroughly
2. Test on different browsers (Chrome, Firefox, Safari)
3. Test responsive design on mobile devices
4. Test edge cases and error scenarios
5. Verify no console errors or warnings

#### Writing Tests

```javascript
// Example test structure
describe('MovieCard Component', () => {
  it('should render movie title', () => {
    // Test implementation
  });
  
  it('should handle click events', () => {
    // Test implementation
  });
  
  it('should display rating correctly', () => {
    // Test implementation
  });
});
```

## Project Structure Guidelines

### When to Create New Files

**Create new component when:**
- Component exceeds 200 lines
- Logic is reused in multiple places
- Component has distinct responsibility

**Create new utility when:**
- Function is used in multiple files
- Logic is complex and testable
- Function has no side effects

**Create new service when:**
- Multiple API calls related to same entity
- Complex business logic needs organization
- Code reusability across components

### File Organization

```
src/
├── components/
│   ├── movies/           # Feature-specific components
│   ├── user/
│   └── ui/              # Shared UI components
├── services/            # API calls and business logic
├── lib/                 # Core functionality and utilities
├── helpers/             # Pure utility functions
└── context/             # Global state management
```

## Documentation Guidelines

### Code Comments

```javascript
/**
 * Fetches movie details from TMDB API
 * @param {string} movieId - The TMDB movie ID
 * @returns {Promise<Object>} Movie data object
 * @throws {Error} If movie not found or API error
 */
async function fetchMovieFromTMDB(movieId) {
  // Implementation
}

// Use comments to explain WHY, not WHAT
// Good: Calculate with tax because API returns pre-tax amount
const totalPrice = price * 1.2;

// Bad: Multiply price by 1.2
const totalPrice = price * 1.2;
```

### README Updates

Update README.md when:
- Adding new features
- Changing environment variables
- Modifying setup process
- Adding dependencies

## Review Process

### For Contributors

1. Respond to reviewer feedback promptly
2. Make requested changes in new commits
3. Ask questions if feedback is unclear
4. Be open to suggestions and improvements

### For Reviewers

1. Review code within 48 hours
2. Provide constructive feedback
3. Test the changes locally
4. Approve if all requirements are met

## Getting Help

If you need help:

1. Check existing documentation
2. Search closed issues for similar problems
3. Ask in GitHub Discussions
4. Contact maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CineVerse!