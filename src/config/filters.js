/**
 * Configuration for content filters
 * Defines preset filter options and behavior
 */
export default {
    timeFilters: {
      label: "Time Period",
      values: [
        { value: "all", label: "All Time" },
        { value: "30", label: "Last Month" },
        { value: "90", label: "Last 3 Months" },
        { value: "365", label: "Last Year" }
      ]
    },
    
    skillLevels: {
      label: "Skill Level",
      values: [
        "Beginner",
        "Intermediate", 
        "Advanced"
      ]
    },
    
    frameworks: {
      label: "Frameworks",
      discoverAdditional: true,  // Auto-discover additional frameworks from content
      values: [
        "Strands",
        "LangChain",
        "LlamaIndex",
        "CrewAI", 
        "LangGraph"
      ]
    },
    
    services: {
      label: "AWS Services",
      discoverAdditional: true,  // Auto-discover additional services from content
      values: [
        "Amazon Bedrock",
        "Amazon SageMaker",
        "Amazon Q",
        "AWS Lambda",
        "Amazon EKS",
        "Amazon OpenSearch"
      ]
    }
  }