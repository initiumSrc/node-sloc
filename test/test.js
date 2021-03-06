/* eslint-env mocha */
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const sloc = require('../index')

describe('Result Properties', () => {
  it('should have correct properties', () => {
    const options = {
      path: 'test/test_assets',
    }

    const result = sloc(options)

    return Promise.all([
      expect(result.then(o => o)).to.eventually.have.property('paths'),
      expect(result.then(o => o.sloc)).to.eventually.have.property('sloc'),
      expect(result.then(o => o.sloc)).to.eventually.have.property('loc'),
      expect(result.then(o => o.sloc)).to.eventually.have.property('blank'),
      expect(result.then((o) => o.sloc)).to.eventually.have.property('comments'),
    ])
  })

  it('should reject promise when path is not supplied', () => {
    const options = {}

    const result = sloc(options)
    return expect(result).to.be.rejected
  })

  it('should reject promise when ignoreDefault is true but extensions is not supplied', () => {
    const options = {
      path: 'test/test_assets',
      ignoreDefault: true,
    }

    const result = sloc(options)
    return expect(result).to.be.rejected
  })
})

describe('Count', () => {
  it('should count SLOC, comments and blank lines correctly', () => {
    const options = {
      path: 'test/test_assets/file.c',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: [ 'test/test_assets/file.c' ],
      sloc: {
        sloc: 47,
        comments: 16,
        blank: 7,
        files: 1,
        loc: 63,
      },
    })
  })

  it('should be able to handle files with only comments', () => {
    const options = {
      path: 'test/test_assets/onlycomments.c',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/onlycomments.c'],
      sloc: {
        sloc: 0,
        comments: 66,
        blank: 0,
        files: 1,
        loc: 66,
      },
    })
  })

  it('should be able to handle empty files', () => {
    const options = {
      path: 'test/test_assets/empty.c',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/empty.c'],
      sloc: {
        sloc: 0,
        comments: 0,
        blank: 0,
        files: 1,
        loc: 0,
      },
    })
  })

  it('should be able to handle other extensions', () => {
    const options = {
      path: 'test/test_assets/otherextension.qq',
      ignoreDefault: true,
      extensions: ['qq'],
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/otherextension.qq'],
      sloc: {
        sloc: 3,
        comments: 6,
        blank: 0,
        files: 1,
        loc: 9,
      },
    })
  })
})

describe('Comment parsing', () => {
  it('should be able to parse html style comments', () => {
    const options = {
      path: 'test/test_assets/lang/file.html',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/lang/file.html'],
      sloc: {
        sloc: 8,
        comments: 5,
        blank: 2,
        files: 1,
        loc: 13,
      },
    })
  })

  it('should be able to parse elixir style comments', () => {
    const options = {
      path: 'test/test_assets/lang/file.ex',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/lang/file.ex'],
      sloc: {
        sloc: 4,
        comments: 4,
        blank: 2,
        files: 1,
        loc: 8,
      },
    })
  })

  it('should be able to parse python comments', () => {
    const options = {
      path: 'test/test_assets/lang/file.py',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/lang/file.py'],
      sloc: {
        sloc: 6,
        comments: 5,
        blank: 0,
        files: 1,
        loc: 11,
      },
    })
  })

  it('should be able to parse lua comments', () => {
    const options = {
      path: 'test/test_assets/lang/file.lua',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/lang/file.lua'],
      sloc: {
        sloc: 6,
        comments: 5,
        blank: 0,
        files: 1,
        loc: 11,
      },
    })
  })

  it('should be able to parse squirrel comments', () => {
    const options = {
      path: 'test/test_assets/lang/file.nut',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/lang/file.nut'],
      sloc: {
        sloc: 2,
        comments: 5,
        blank: 0,
        files: 1,
        loc: 7,
      },
    })
  })

  it('should be able to parse coffeescript comments', () => {
    const options = {
      path: 'test/test_assets/lang/file.coffee',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/lang/file.coffee'],
      sloc: {
        sloc: 7,
        comments: 8,
        blank: 4,
        files: 1,
        loc: 15,
      },
    })
  })

  it('should be able to parse ruby comments', () => {
    const options = {
      path: 'test/test_assets/lang/file.rb',
    }

    const result = sloc(options)
    return expect(result).to.eventually.eql({
      paths: ['test/test_assets/lang/file.rb'],
      sloc: {
        sloc: 12,
        comments: 5,
        blank: 2,
        files: 1,
        loc: 17,
      },
    })
  })
})
