var assert = require("chai").assert
var q2m = require("../index")

describe("query-to-mongo(query) =>", function () {
	describe(".criteria", function () {
		it("should create criteria", function () {
			var results = q2m("field=value")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: "value"})
		})
		it("should create numeric criteria", function () {
			var results = q2m("i=10&f=1.2")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {"i": 10, "f": 1.2})
		})
		it("should create boolean criteria", function () {
			var results = q2m("t=true&f=false")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {t: true, f: false})
		})
		it("should create Date criteria from YYYY-MM", function () {
			var results = q2m("d=2010-04"), expect
			assert.ok(results.criteria)
			expect = new Date(2010, 3)
			// FIXME: Thu Apr 01 2010 00:00:00 GMT+0200 (CEST)
			console.log('>>>>>>>> Date: ' + expect);
			expect.setUTCDate(1)
			// FIXME: Mon Mar 01 2010 23:00:00 GMT+0100 (CET)
			console.log('>>>>>>>> Date: ' + expect);
			expect.setUTCHours(0)
			// FIXME: Mon Mar 01 2010 01:00:00 GMT+0100 (CET)
			console.log('>>>>>>>> Date: ' + expect);
			assert.ok(results.criteria.d instanceof Date, 'instanceof Date')
			assert.deepEqual(results.criteria, {d: expect})
		})
		it("should create Date criteria from YYYY-MM-DD", function () {
			var results = q2m("d=2010-04-01"), expect
			assert.ok(results.criteria)
			expect = new Date(2010, 3, 1)
			expect.setUTCHours(0)
			assert.ok(results.criteria.d instanceof Date, 'instanceof Date')
			assert.deepEqual(results.criteria, {d: expect})
		})
		it("should create Date criteria from YYYY-MM-DDThh:mmZ", function () {
			var results = q2m("d=2010-04-01T12:00Z")
			assert.ok(results.criteria)
			expect = new Date(2010, 3, 1)
			expect.setUTCHours(12)
			expect.setUTCMinutes(0)
			assert.ok(results.criteria.d instanceof Date, 'instanceof Date')
			assert.deepEqual(results.criteria, {d: expect})
		})
		it("should create Date criteria from YYYY-MM-DDThh:mm:ssZ", function () {
			var results = q2m("d=2010-04-01T12:00:30Z")
			assert.ok(results.criteria)
			expect = new Date(2010, 3, 1)
			expect.setUTCHours(12)
			expect.setUTCMinutes(0)
			expect.setUTCSeconds(30)
			assert.ok(results.criteria.d instanceof Date, 'instanceof Date')
			assert.deepEqual(results.criteria, {d: expect})
		})
		it("should create Date criteria from YYYY-MM-DDThh:mm:ss.sZ", function () {
			var results = q2m("d=2010-04-01T12:00:30.250Z")
			assert.ok(results.criteria)
			expect = new Date(2010, 3, 1)
			expect.setUTCHours(12)
			expect.setUTCMinutes(0)
			expect.setUTCSeconds(30)
			expect.setUTCMilliseconds(250)
			assert.ok(results.criteria.d instanceof Date, 'instanceof Date')
			assert.deepEqual(results.criteria, {d: expect})
		})
		it("should create Date criteria from YYYY-MM-DDThh:mm:ss.s-hh:mm", function () {
			var results = q2m("d=2010-04-01T11:00:30.250-01:00")
			assert.ok(results.criteria)
			expect = new Date(2010, 3, 1)
			expect.setUTCHours(12)
			expect.setUTCMinutes(0)
			expect.setUTCSeconds(30)
			expect.setUTCMilliseconds(250)
			assert.ok(results.criteria.d instanceof Date, 'instanceof Date')
			assert.deepEqual(results.criteria, {d: expect})
		})
		it("should create Date criteria from YYYY-MM-DDThh:mm:ss.s+hh:mm", function () {
			var results = q2m(encodeURIComponent("d=2010-04-01T13:00:30.250+01:00"))
			assert.ok(results.criteria)
			expect = new Date(2010, 3, 1)
			expect.setUTCHours(12)
			expect.setUTCMinutes(0)
			expect.setUTCSeconds(30)
			expect.setUTCMilliseconds(250)
			assert.ok(results.criteria.d instanceof Date, 'instanceof Date')
			assert.deepEqual(results.criteria, {d: expect})
		})
		it("should create $gt criteria", function () {
			var results = q2m("field>value")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: {"$gt": "value"}})
		})
		it("should create $lt criteria", function () {
			var results = q2m("field<value")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: {"$lt": "value"}})
		})
		it("should create $gte criteria", function () {
			var results = q2m("field>=value")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: {"$gte": "value"}})
		})
		it("should create $lte criteria", function () {
			var results = q2m("field<=value")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: {"$lte": "value"}})
		})
		it("should create $ne criteria", function () {
			var results = q2m("field!=value")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: {"$ne": "value"}})
		})
		it("should create $in criteria", function () {
			var results = q2m("field=a&field=b")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: {"$in": ["a","b"]}})
		})
		it("should create $nin criteria", function () {
			var results = q2m("field!=a&field!=b")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: {"$nin": ["a","b"]}})
		})
		it("should ignore criteria", function () {
			var results = q2m("field=value&envelope=true&&skip=0&limit=10&fields=id,name&sort=name", { ignore: ['envelope']})
			assert.ok(results.criteria)
			assert.notOk(results.criteria.envelope, "envelope")
			assert.notOk(results.criteria.skip, "skip")
			assert.notOk(results.criteria.limit, "limit")
			assert.notOk(results.criteria.fields, "fields")
			assert.notOk(results.criteria.sort, "sort")
			assert.deepEqual(results.criteria, {field: "value"})
		})
		it("should create $regex criteria", function () {
			var results = q2m("field=/pattern/")
			assert.ok(results.criteria)
			assert.deepEqual(results.criteria, {field: {"$regex": "/pattern/"}})
		})
	})

	describe(".options", function () {
		it("should create paging options", function () {
			var results = q2m("offset=8&limit=16")
			assert.ok(results.options)
			assert.deepEqual(results.options, {skip: 8, limit: 16})
		})
		it("should create field option", function () {
			var results = q2m("fields=a,b,c")
			assert.ok(results.options)
			assert.deepEqual(results.options, {fields: {a:true, b:true, c:true}})
		})
		it("should create omit option", function () {
			var results = q2m("omit=b")
			assert.ok(results.options)
			assert.deepEqual(results.options, {fields: {b:false}})
		})
		it("should create omit option", function () {
			var results = q2m("omit=b")
			assert.ok(results.options)
			assert.deepEqual(results.options, {fields: {b:false}})
		})
		it("should create sort option", function () {
			var results = q2m("sort=a,+b,-c")
			assert.ok(results.options)
			assert.deepEqual(results.options, {sort: {a:1, b:1, c:-1}})
		})
		it("should limit queries", function () {
			var results = q2m("limit=100", {maxLimit: 50})
			assert.ok(results.options)
			assert.deepEqual(results.options, {limit: 50})
		})
	})
})
