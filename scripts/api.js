import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==========================================
// LLM-OPTIMIZED PARSING
// ==========================================

/**
 * Parse markdown file with LLM-friendly structure
 * Optimizes for:
 * - Clear hierarchical structure
 * - Easy navigation
 * - Context-rich metadata
 * - Searchable content sections
 */
export function parseMarkdownForLLM(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: markdown } = matter(content);
  
  const slug = relativePath
    .replace(/\.md$/, '')
    .replace(/\\/g, '/')
    .replace(/^\//, '');
  
  const stat = fs.statSync(filePath);
  
  // Extract structured headings with content
  const sections = extractSections(markdown);
  
  // Extract all code blocks
  const codeBlocks = extractCodeBlocks(markdown);
  
  // Generate summary from first paragraph
  const summary = generateSummary(markdown);
  
  // Extract keywords and tags
  const keywords = extractKeywords(markdown, frontmatter);
  
  // Build table of contents
  const tableOfContents = buildTableOfContents(sections);
  
  return {
    // Basic metadata
    slug,
    path: relativePath,
    title: frontmatter.title || sections[0]?.heading || slug,
    
    // LLM-friendly description
    description: frontmatter.description || summary,
    
    // Quick summary for context
    summary,
    
    // Searchable keywords
    keywords,
    tags: frontmatter.tags || [],
    category: frontmatter.category || extractCategory(slug),
    
    // Structured content for easy parsing
    sections,
    
    // Code examples extracted separately
    codeExamples: codeBlocks,
    
    // Table of contents for navigation
    tableOfContents,
    
    // Full markdown (for detailed analysis)
    fullContent: markdown,
    
    // Metadata
    frontmatter,
    lastModified: stat.mtime.toISOString(),
    wordCount: countWords(markdown),
    estimatedReadingTime: Math.ceil(countWords(markdown) / 200), // minutes
    
    // LLM context hints
    contentType: determineContentType(markdown, frontmatter),
    complexity: estimateComplexity(markdown, codeBlocks),
  };
}

/**
 * Extract sections with their content
 * Returns hierarchical structure for easy navigation
 */
function extractSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let currentSection = null;
  let currentContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        currentSection.contentPlain = stripMarkdown(currentSection.content);
        sections.push(currentSection);
      }
      
      // Start new section
      const level = headingMatch[1].length;
      const heading = headingMatch[2];
      const id = heading
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      currentSection = {
        id,
        level,
        heading,
        content: '',
        contentPlain: '',
        lineNumber: i + 1,
        codeBlocks: [],
        lists: [],
        links: []
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
      
      // Extract code blocks within this section
      if (line.startsWith('```')) {
        const codeBlock = extractCodeBlockFromLine(lines, i);
        if (codeBlock) {
          currentSection.codeBlocks.push(codeBlock);
        }
      }
      
      // Extract lists
      if (line.match(/^[\s]*[-*+]\s+/) || line.match(/^[\s]*\d+\.\s+/)) {
        currentSection.lists.push(line.trim());
      }
      
      // Extract links
      const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      if (linkMatch) {
        linkMatch.forEach(link => {
          const [, text, url] = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
          currentSection.links.push({ text, url });
        });
      }
    }
  }
  
  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    currentSection.contentPlain = stripMarkdown(currentSection.content);
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Extract all code blocks with metadata
 */
function extractCodeBlocks(markdown) {
  const codeBlocks = [];
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) {
      const language = lines[i].slice(3).trim() || 'plaintext';
      const codeLines = [];
      i++;
      
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      
      const code = codeLines.join('\n');
      codeBlocks.push({
        language,
        code,
        lineCount: codeLines.length,
        // Detect if it's an example, test, or implementation
        purpose: detectCodePurpose(code, language)
      });
    }
  }
  
  return codeBlocks;
}

function extractCodeBlockFromLine(lines, startIndex) {
  if (!lines[startIndex].startsWith('```')) return null;
  
  const language = lines[startIndex].slice(3).trim() || 'plaintext';
  const codeLines = [];
  let i = startIndex + 1;
  
  while (i < lines.length && !lines[i].startsWith('```')) {
    codeLines.push(lines[i]);
    i++;
  }
  
  return {
    language,
    code: codeLines.join('\n'),
    lineCount: codeLines.length
  };
}

/**
 * Generate concise summary from content
 */
function generateSummary(markdown) {
  // Remove code blocks for summary
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '');
  
  // Get first meaningful paragraph
  const paragraphs = withoutCode
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p && !p.startsWith('#'));
  
  const firstParagraph = paragraphs[0] || '';
  
  // Limit to ~200 characters
  if (firstParagraph.length > 200) {
    return firstParagraph.substring(0, 197) + '...';
  }
  
  return firstParagraph;
}

/**
 * Extract keywords for search and context
 */
function extractKeywords(markdown, frontmatter) {
  const keywords = new Set();
  
  // Add explicit tags
  if (frontmatter.tags) {
    frontmatter.tags.forEach(tag => keywords.add(tag.toLowerCase()));
  }
  
  // Extract from headings
  const headings = markdown.match(/^#{1,6}\s+(.+)$/gm) || [];
  headings.forEach(heading => {
    const words = heading.replace(/^#+\s+/, '').split(/\s+/);
    words.forEach(word => {
      const cleaned = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleaned.length > 3) keywords.add(cleaned);
    });
  });
  
  // Extract technical terms (camelCase, PascalCase, function names)
  const technicalTerms = markdown.match(/\b[a-z]+[A-Z][a-zA-Z]*\b/g) || [];
  technicalTerms.forEach(term => keywords.add(term));
  
  // Extract function/method names from code
  const functionNames = markdown.match(/\b(function|const|let|var)\s+(\w+)/g) || [];
  functionNames.forEach(match => {
    const name = match.split(/\s+/).pop();
    keywords.add(name);
  });
  
  return Array.from(keywords).slice(0, 20); // Limit to top 20
}

/**
 * Build hierarchical table of contents
 */
function buildTableOfContents(sections) {
  const toc = [];
  const stack = [{ level: 0, children: toc }];
  
  sections.forEach(section => {
    const item = {
      id: section.id,
      heading: section.heading,
      level: section.level,
      children: []
    };
    
    // Find parent level
    while (stack.length > 1 && stack[stack.length - 1].level >= section.level) {
      stack.pop();
    }
    
    stack[stack.length - 1].children.push(item);
    stack.push(item);
  });
  
  return toc;
}

/**
 * Determine content type for LLM context
 */
function determineContentType(markdown, frontmatter) {
  const content = markdown.toLowerCase();
  
  if (content.includes('api') || content.includes('reference')) return 'api-reference';
  if (content.includes('tutorial') || content.includes('guide')) return 'tutorial';
  if (content.includes('example')) return 'example';
  if (content.includes('installation') || content.includes('setup')) return 'setup-guide';
  if (frontmatter.category) return frontmatter.category;
  
  return 'documentation';
}

/**
 * Estimate content complexity for LLM
 */
function estimateComplexity(markdown, codeBlocks) {
  let score = 0;
  
  // More code = higher complexity
  score += codeBlocks.length * 2;
  
  // Technical terms increase complexity
  const technicalTerms = markdown.match(/\b[a-z]+[A-Z][a-zA-Z]*\b/g) || [];
  score += Math.min(technicalTerms.length / 5, 10);
  
  // Long documents = higher complexity
  const wordCount = countWords(markdown);
  score += Math.min(wordCount / 200, 10);
  
  if (score < 10) return 'beginner';
  if (score < 25) return 'intermediate';
  return 'advanced';
}

/**
 * Helper: Strip markdown formatting
 */
function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/[*_~]{1,2}([^*_~]+)[*_~]{1,2}/g, '$1') // Remove emphasis
    .replace(/^#{1,6}\s+/gm, '') // Remove headings
    .trim();
}

/**
 * Helper: Count words
 */
function countWords(text) {
  const withoutCode = text.replace(/```[\s\S]*?```/g, '');
  return withoutCode.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Helper: Extract category from path
 */
function extractCategory(slug) {
  const parts = slug.split('/');
  return parts.length > 1 ? parts[0] : 'general';
}

/**
 * Helper: Detect code purpose
 */
function detectCodePurpose(code, language) {
  const lowerCode = code.toLowerCase();
  
  if (lowerCode.includes('test') || lowerCode.includes('expect')) return 'test';
  if (lowerCode.includes('example') || lowerCode.includes('const')) return 'example';
  if (lowerCode.includes('interface') || lowerCode.includes('type')) return 'type-definition';
  
  return 'implementation';
}

/**
 * Helper: Get all markdown files
 */
export function getMarkdownFiles(dir, fileList = [], baseDir = dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'public') {
      getMarkdownFiles(filePath, fileList, baseDir);
    } else if (file.endsWith('.md')) {
      fileList.push({
        fullPath: filePath,
        relativePath: path.relative(baseDir, filePath)
      });
    }
  });
  
  return fileList;
}

// ==========================================
// STATIC JSON GENERATION
// ==========================================

export function generateLLMOptimizedAPI(docsDir, outputDir) {
  console.log('🤖 Generating LLM-optimized documentation API...\n');
  
  const markdownFiles = getMarkdownFiles(docsDir);
  const docs = markdownFiles.map(({ fullPath, relativePath }) => 
    parseMarkdownForLLM(fullPath, relativePath)
  );
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate comprehensive index
  const index = {
    total: docs.length,
    metadata: {
      generatedAt: new Date().toISOString(),
      totalWords: docs.reduce((sum, doc) => sum + doc.wordCount, 0),
      totalCodeExamples: docs.reduce((sum, doc) => sum + doc.codeExamples.length, 0),
      categories: [...new Set(docs.map(d => d.category))],
      contentTypes: [...new Set(docs.map(d => d.contentType))]
    },
    docs: docs.map(doc => ({
      slug: doc.slug,
      path: doc.path,
      title: doc.title,
      summary: doc.summary,
      category: doc.category,
      contentType: doc.contentType,
      complexity: doc.complexity,
      keywords: doc.keywords,
      tags: doc.tags,
      sections: doc.sections.map(s => ({
        id: s.id,
        heading: s.heading,
        level: s.level
      })),
      codeExampleCount: doc.codeExamples.length,
      wordCount: doc.wordCount,
      estimatedReadingTime: doc.estimatedReadingTime,
      lastModified: doc.lastModified
    }))
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'index.json'),
    JSON.stringify(index, null, 2)
  );
  console.log(`✅ Generated index.json with ${docs.length} documents`);
  
  // Generate individual doc files
  docs.forEach(doc => {
    const docPath = path.join(outputDir, `${doc.slug}.json`);
    const docDir = path.dirname(docPath);
    
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir, { recursive: true });
    }
    
    fs.writeFileSync(docPath, JSON.stringify(doc, null, 2));
  });
  console.log(`✅ Generated ${docs.length} individual document files`);
  
  // Generate search index optimized for LLM queries
  const searchIndex = docs.map(doc => ({
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    keywords: doc.keywords,
    category: doc.category,
    contentType: doc.contentType,
    sections: doc.sections.map(s => ({
      heading: s.heading,
      contentPlain: s.contentPlain
    }))
  }));
  
  fs.writeFileSync(
    path.join(outputDir, 'search.json'),
    JSON.stringify(searchIndex, null, 2)
  );
  console.log('✅ Generated search.json');
  
  // Generate category index
  const categoryIndex = {};
  docs.forEach(doc => {
    if (!categoryIndex[doc.category]) {
      categoryIndex[doc.category] = [];
    }
    categoryIndex[doc.category].push({
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary
    });
  });
  
  fs.writeFileSync(
    path.join(outputDir, 'categories.json'),
    JSON.stringify(categoryIndex, null, 2)
  );
  console.log('✅ Generated categories.json');
  
  // Generate comprehensive routes listing for LLM
  const routes = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    baseUrl: '/api',
    
    // Overview stats
    stats: {
      totalDocuments: docs.length,
      totalWords: index.metadata.totalWords,
      totalCodeExamples: index.metadata.totalCodeExamples,
      categories: index.metadata.categories.length,
      contentTypes: index.metadata.contentTypes.length
    },
    
    // Core endpoints for LLM to use
    endpoints: {
      routes: {
        path: '/api/routes.json',
        description: 'This file - complete API route listing and documentation discovery',
        size: 'varies',
        usage: 'Fetch this first to discover all available routes'
      },
      index: {
        path: '/api/index.json',
        description: 'Complete list of all documents with metadata (titles, summaries, keywords)',
        size: `~${Math.round(JSON.stringify(index).length / 1024)}KB`,
        usage: 'Browse all documents or search by metadata'
      },
      search: {
        path: '/api/search.json',
        description: 'Lightweight search index with document summaries and keywords',
        size: `~${Math.round(JSON.stringify(searchIndex).length / 1024)}KB`,
        usage: 'Quick keyword-based search across all documents'
      },
      categories: {
        path: '/api/categories.json',
        description: 'Documents organized by category',
        size: `~${Math.round(JSON.stringify(categoryIndex).length / 1024)}KB`,
        usage: 'Browse documents by category'
      },
      metadata: {
        path: '/api/metadata.json',
        description: 'Overall documentation statistics and metadata',
        size: '~5KB',
        usage: 'Get overview statistics about the documentation'
      }
    },
    
    // All available categories
    categories: index.metadata.categories.map(cat => ({
      name: cat,
      count: docs.filter(d => d.category === cat).length,
      route: `/api/category-${cat}.json`,
      description: `All ${cat} documents`
    })),
    
    // All individual documents
    documents: docs.map(doc => ({
      slug: doc.slug,
      route: `/api/${doc.slug}.json`,
      title: doc.title,
      category: doc.category,
      contentType: doc.contentType,
      complexity: doc.complexity,
      keywords: doc.keywords.slice(0, 8),
      summary: doc.summary.substring(0, 120) + '...',
      wordCount: doc.wordCount,
      codeExamples: doc.codeExamples.length,
      sections: doc.sections.length,
      estimatedReadingTime: doc.estimatedReadingTime
    })),
    
    // Search capabilities
    capabilities: {
      search: {
        fields: ['title', 'summary', 'keywords', 'category', 'contentPlain'],
        description: 'Search across these fields in documents'
      },
      filter: {
        fields: ['category', 'complexity', 'contentType'],
        values: {
          category: index.metadata.categories,
          complexity: ['beginner', 'intermediate', 'advanced'],
          contentType: index.metadata.contentTypes
        },
        description: 'Filter documents by these criteria'
      },
      languages: {
        available: [...new Set(docs.flatMap(d => d.codeExamples.map(ex => ex.language)))],
        description: 'Programming languages available in code examples'
      }
    },
    
    // Usage guide for LLM
    usage: {
      quickStart: {
        step1: 'Fetch /api/routes.json (this file) to discover all available routes',
        step2: 'Use /api/index.json to browse all documents with metadata',
        step3: 'Use /api/search.json for keyword-based searching',
        step4: 'Fetch /api/{slug}.json to get complete document content'
      },
      examples: {
        findByKeyword: {
          description: 'Find documents containing specific keyword',
          steps: [
            'Fetch /api/search.json',
            'Filter by keyword in title, summary, or keywords array',
            'Use the slug to fetch full document from /api/{slug}.json'
          ]
        },
        findByCategory: {
          description: 'Get all documents in a category',
          steps: [
            'Fetch /api/categories.json to see all categories',
            'Or fetch /api/category-{name}.json for specific category',
            'Use slugs to fetch full documents'
          ]
        },
        getSpecificSection: {
          description: 'Get a specific section from a document',
          steps: [
            'Fetch /api/{slug}.json',
            'Navigate to sections array',
            'Find section by id or heading',
            'Access section.content or section.contentPlain'
          ]
        },
        getCodeExamples: {
          description: 'Get code examples from a document',
          steps: [
            'Fetch /api/{slug}.json',
            'Access codeExamples array',
            'Filter by language if needed',
            'Each example includes code, language, and purpose'
          ]
        }
      },
      tips: [
        'Use /api/index.json for browsing - it includes all metadata without full content',
        'Use /api/search.json for searching - it\'s optimized for keyword matching',
        'Fetch specific documents only when you need full content',
        'Check complexity field to recommend appropriate content for user level',
        'Use keywords array for semantic search and content discovery',
        'Sections array provides document structure for navigation',
        'codeExamples are pre-extracted with language and purpose metadata'
      ]
    },
    
    // Quick reference for common queries
    quickReference: {
      'List all documents': 'GET /api/index.json',
      'Search documents': 'GET /api/search.json',
      'Get specific document': 'GET /api/{slug}.json',
      'Browse by category': 'GET /api/categories.json',
      'Get category documents': 'GET /api/category-{name}.json',
      'View all routes': 'GET /api/routes.json (this file)'
    }
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'routes.json'),
    JSON.stringify(routes, null, 2)
  );
  console.log('✅ Generated routes.json');
  
  // Generate metadata file
  const metadata = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    stats: {
      totalDocs: docs.length,
      totalWords: index.metadata.totalWords,
      totalCodeExamples: index.metadata.totalCodeExamples,
      avgWordsPerDoc: Math.round(index.metadata.totalWords / docs.length),
      avgReadingTime: Math.round(docs.reduce((sum, d) => sum + d.estimatedReadingTime, 0) / docs.length)
    },
    categories: index.metadata.categories,
    contentTypes: index.metadata.contentTypes,
    complexityDistribution: {
      beginner: docs.filter(d => d.complexity === 'beginner').length,
      intermediate: docs.filter(d => d.complexity === 'intermediate').length,
      advanced: docs.filter(d => d.complexity === 'advanced').length
    },
    languageDistribution: docs.flatMap(d => d.codeExamples.map(ex => ex.language))
      .reduce((acc, lang) => {
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {})
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  console.log('✅ Generated metadata.json');
  
  console.log('\n📊 Statistics:');
  console.log(`   Total documents: ${docs.length}`);
  console.log(`   Total words: ${index.metadata.totalWords.toLocaleString()}`);
  console.log(`   Code examples: ${index.metadata.totalCodeExamples}`);
  console.log(`   Categories: ${index.metadata.categories.join(', ')}`);
  console.log(`   Content types: ${index.metadata.contentTypes.join(', ')}`);
  console.log(`\n📡 Generated ${docs.length + 6} total files`);
  console.log(`   - ${docs.length} document files`);
  console.log(`   - 6 index/metadata files\n`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const docsDir = path.join(__dirname, '../docs');
  const outputDir = path.join(__dirname, '../docs/public/api');
  
  try {
    generateLLMOptimizedAPI(docsDir, outputDir);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}