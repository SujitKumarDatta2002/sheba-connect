const axios = require('axios');

// API Testing Script for Submission
class APITester {
  constructor(baseUrl, port) {
    this.baseURL = `http://localhost:${port}/api`;
    this.testResults = [];
  }

  async testEndpoint(method, endpoint, data = null, params = null) {
    try {
      const config = {
        method: method.toLowerCase(),
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) config.data = data;
      if (params) config.params = params;

      const response = await axios(config);
      
      this.testResults.push({
        method: method.toUpperCase(),
        endpoint: endpoint,
        status: '✅ PASS',
        statusCode: response.status,
        response: response.data
      });

      console.log(`✅ ${method.toUpperCase()} ${endpoint} - ${response.status}`);
      return response.data;

    } catch (error) {
      this.testResults.push({
        method: method.toUpperCase(),
        endpoint: endpoint,
        status: '❌ FAIL',
        error: error.message,
        statusCode: error.response?.status || 'No Response'
      });

      console.log(`❌ ${method.toUpperCase()} ${endpoint} - ${error.response?.status || 'Connection Error'}`);
      return null;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting API Tests...\n');

    // Test data
    const userId = '60f7b3b3b3b3b3b3b3b3b3b4';
    const serviceId = '60f7b3b3b3b3b3b3b3b3b3b3';

    // Feature 1: Service Management APIs
    console.log('📋 Testing Service Management APIs...\n');
    
    await this.testEndpoint('GET', '/services');
    await this.testEndpoint('GET', `/services/saved/${userId}`);
    await this.testEndpoint('POST', '/services/save', { userId, serviceId });
    await this.testEndpoint('GET', `/services/warnings/${userId}`);
    await this.testEndpoint('DELETE', '/services/remove', { userId, serviceId });

    console.log('\n📝 Testing Complaint Management APIs...\n');

    // Feature 2: Complaint Management APIs
    await this.testEndpoint('GET', `/complaints/user/${userId}`);
    
    const newComplaint = await this.testEndpoint('POST', '/complaints', {
      user: userId,
      subject: 'Test Complaint',
      description: 'This is a test complaint for API testing',
      priority: 'Medium'
    });

    if (newComplaint && newComplaint._id) {
      await this.testEndpoint('PATCH', `/complaints/${newComplaint._id}`, {
        status: 'In Progress'
      });
      
      await this.testEndpoint('DELETE', `/complaints/${newComplaint._id}`);
    }

    // Print summary
    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = this.testResults.filter(r => r.status === '✅ PASS').length;
    const failed = this.testResults.filter(r => r.status === '❌ FAIL').length;
    
    console.log(`Total Tests: ${this.testResults.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);

    console.log('\n📋 Detailed Results:');
    this.testResults.forEach(result => {
      console.log(`${result.status} ${result.method} ${result.endpoint} - ${result.statusCode || 'No Response'}`);
    });
  }
}

// Usage
const port = process.argv[2] || 5000;
const tester = new APITester('http://localhost', port);

console.log(`🔧 Testing APIs on port: ${port}`);
console.log(`🌐 Base URL: http://localhost:${port}/api\n`);

tester.runAllTests().catch(console.error);
