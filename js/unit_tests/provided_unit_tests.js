'use strict';

var expect = chai.expect;
describe('First unit test', function() {

    it('Some tests', function() {
        /*
         We're using Mocha and Chai to do unit testing.

         Mocha is what sets up the tests (the "describe" and "it" portions), while
         Chai does the assertion/expectation checking.

         Links:
         Mocha: http://mochajs.org
         Chai: http://chaijs.com

         Note: This is a bunch of tests in one it; you'll probably want to separate them
         out into separate groups to make debugging easier. It's also more satisfying
         to see a bunch of unit tests pass on the results page :)
        */

        // Here is the most basic test you could think of:
        expect(1==1, '1==1').to.be.ok;

        // You can also for equality:
        expect(1, '1 should equal 1').to.equal(1);

        // JavaScript can be tricky with equality tests
        expect(1=='1', "1 should == '1'").to.be.true;

        // Make sure you understand the differences between == and ===
        expect(1==='1', "1 shouldn't === '1'").to.be.false;

        // Use eql for deep comparisons
        expect([1] == [1], "[1] == [1] should be false because they are different objects").to.be.false;

        expect([1], "[1] eqls [1] should be true").to.eql([1]);
    });

    it('Callback demo unit test', function() {
        /*
        Suppose you have a function or object that accepts a callback function,
        which should be called at some point in time (like, for example, a model
        that will notify listeners when an event occurs). Here's how you can test
        whether the callback is ever called.
         */

        // First, we'll create a function that takes a callback, which the function will
        // later call with a single argument. In tests below, we'll use models that
        // take listeners that will be later called
        var functionThatTakesCallback = function(callbackFn) {
            return function(arg) {
                callbackFn(arg);
            };
        };

        // Now we want to test if the function will ever call the callbackFn when called.
        // To do so, we'll use Sinon's spy capability (http://sinonjs.org/)
        var spyCallbackFn = sinon.spy();

        // Now we'll create the function with the callback
        var instantiatedFn = functionThatTakesCallback(spyCallbackFn);

        // This instantiated function should take a single argument and call the callbackFn with it:
        instantiatedFn("foo");

        // Now we can check that it was called:
        expect(spyCallbackFn.called, 'Callback function should be called').to.be.ok;

        // We can check the number of times called:
        expect(spyCallbackFn.callCount, 'Number of times called').to.equal(1);

        // And we can check that it got its argument correctly:
        expect(spyCallbackFn.calledWith('foo'), 'Argument verification').to.be.true;

        // Or, equivalently, get the first argument of the first call:
        expect(spyCallbackFn.args[0][0], 'Argument verification 2').to.equal('foo');

        // This should help you understand the listener testing code below
    });

    //it('Listener unit test for GraphModel', function() {
    //    var graphModel = new GraphModel();
    //    var firstListener = sinon.spy();
    //
    //    graphModel.addListener(firstListener);
    //    graphModel.selectGraph("MyGraph");
    //
    //    expect(firstListener.called, 'GraphModel listener should be called').to.be.ok;
    //    expect(firstListener.calledWith('MyGraph'), 'GraphModel argument verification').to.be.true;
    //
    //    var secondListener = sinon.spy();
    //    graphModel.addListener(secondListener);
    //    expect(firstListener.callCount, 'GraphModel first listener should have been called twice').to.equal(2);
    //    expect(secondListener.called, "GraphModel second listener should have been called").to.be.ok;
    //});

});

describe('ActivityStoreModel unit tests', function() {

    // Test 1
    /*
    ** This unit test checks whether listeners are called with right arguments when we add new data point
     */
    it('Listener unit test 1 for ActivityStoreModel', function() {
        var activityModel = new ActivityStoreModel();
        var firstListener = sinon.spy();
        activityModel.addListener(firstListener);

        var activityDataPoint = new ActivityData(
            'writing code',
            {
                energyLevel: 1,
                stressLevel: 2,
                happinessLevel: 3
            },
            120
        );

        activityModel.addActivityDataPoint(activityDataPoint);

        expect(firstListener.called, 'ActivityStoreModel listener should be called').to.be.ok;
        // following test sometimes succeeds, sometimes fails because of new Date() argument
        //expect(firstListener.calledWith(ACTIVITY_DATA_ADDED_EVENT, new Date(), activityDataPoint), 'ActivityStoreModel argument verification').to.be.true;
        expect(firstListener.args[0][0], 'Argument verification 1').to.equal(ACTIVITY_DATA_ADDED_EVENT);
        expect(firstListener.args[0][2], 'Argument verification 2').to.equal(activityDataPoint);

        var secondListener = sinon.spy();
        activityModel.addListener(secondListener);

        var activityDataPoint2 = new ActivityData(
            'watching TV',
            {
                energyLevel: 3,
                stressLevel: 4,
                happinessLevel: 5
            },
            100
        );

        activityModel.addActivityDataPoint(activityDataPoint2);

        expect(firstListener.callCount, 'ActivityStoreModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "ActivityStoreModel second listener should have been called").to.be.ok;

    });

    // Test 2
    /*
    ** This unit test checks whether listeners are called with right arguments when we change a data point
     */
    it('Listener unit test 2 for ActivityStoreModel', function() {
        var activityModel = new ActivityStoreModel();
        var firstListener = sinon.spy();
        activityModel.addListener(firstListener);

        var activityDataPoint = new ActivityData(
            'reading book',
            {
                energyLevel: 2,
                stressLevel: 2,
                happinessLevel: 3
            },
            40
        );

        activityModel.addActivityDataPoint(activityDataPoint);

        expect(firstListener.called, 'ActivityStoreModel listener should be called').to.be.ok;
        //expect(firstListener.calledWith(ACTIVITY_DATA_ADDED_EVENT, new Date(), activityDataPoint), 'ActivityStoreModel argument verification').to.be.true;
        expect(firstListener.args[0][0], 'Argument verification 1').to.equal(ACTIVITY_DATA_ADDED_EVENT);
        expect(firstListener.args[0][2], 'Argument verification 2').to.equal(activityDataPoint);

        var secondListener = sinon.spy();
        activityModel.addListener(secondListener);

        activityDataPoint = new ActivityData(
            'reading book',
            {
                energyLevel: 3,
                stressLevel: 4,
                happinessLevel: 4
            },
            90
        );

        activityModel.addActivityDataPoint(activityDataPoint);

        expect(firstListener.callCount, 'ActivityStoreModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "ActivityStoreModel second listener should have been called").to.be.ok;
        //expect(firstListener.calledWith(ACTIVITY_DATA_CHANGED_EVENT, new Date(), activityDataPoint), 'ActivityStoreModel argument verification').to.be.true;
        expect(secondListener.args[0][0], 'Argument verification 3').to.equal(ACTIVITY_DATA_CHANGED_EVENT);
        expect(secondListener.args[0][2], 'Argument verification 4').to.equal(activityDataPoint);
        expect(firstListener.args[1][0], 'Argument verification 3').to.equal(ACTIVITY_DATA_CHANGED_EVENT);
        expect(firstListener.args[1][2], 'Argument verification 4').to.equal(activityDataPoint);
    });

    // Test 3
    /*
    ** This unit test checks whether listeners are called when we remove an existing data and not existing data
     */
    it('Listener unit test 3 for ActivityStoreModel', function() {
        var activityModel = new ActivityStoreModel();
        var firstListener = sinon.spy();
        activityModel.addListener(firstListener);

        var activityDataPoint = new ActivityData(
            'eating dinner',
            {
                energyLevel: 1,
                stressLevel: 3,
                happinessLevel: 4
            },
            30
        );

        activityModel.removeActivityDataPoint(activityDataPoint);

        expect(firstListener.called, 'ActivityStoreModel listener should be called').to.not.be.ok;
        activityModel.addActivityDataPoint(activityDataPoint);

        activityModel.removeActivityDataPoint(activityDataPoint);
        expect(firstListener.called, 'ActivityStoreModel listener should be called').to.be.ok;

    });
});

describe('GraphModel unit tests', function() {

    // Test 1
    /*
    ** This unit test checks whether listeners are called if select a new graph
     */
    it('Listener unit test 1 for GraphModel', function() {
        var graphModel = new GraphModel();
        var firstListener = sinon.spy();
        graphModel.addListener(firstListener);
        graphModel.selectGraph('graph_bar');

        expect(firstListener.called, 'GraphModel listener should be called').to.be.ok;
        //expect(firstListener.calledWith(GRAPH_SELECTED_EVENT, new Date(), 'graph_bar'), 'GraphModel argument verification').to.be.true;
        expect(firstListener.args[0][0], 'Argument verification 1').to.equal(GRAPH_SELECTED_EVENT);
        expect(firstListener.args[0][2], 'Argument verification 2').to.equal('graph_bar');

        var secondListener = sinon.spy();
        graphModel.addListener(secondListener);
        graphModel.selectGraph('graph_table');

        expect(firstListener.callCount, 'GraphModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "GraphModel second listener should have been called").to.be.ok;
    });

    // Test 2
    /*
    ** This unit test checks whether listeners are not called if select current graph or
    ** a graph that is not in available graph names
     */
    it('Listener unit test 2 for GraphModel', function() {
        var graphModel = new GraphModel();
        var firstListener = sinon.spy();
        graphModel.addListener(firstListener);
        graphModel.selectGraph('MyGraph');

        expect(firstListener.called, 'GraphModel listener should be called').to.not.be.ok;
        expect(firstListener.calledWith(GRAPH_SELECTED_EVENT, new Date(), 'MyGraph'), 'GraphModel argument verification').to.be.false;

        var secondListener = sinon.spy();
        graphModel.addListener(secondListener);
        graphModel.selectGraph('graph_table');

        expect(firstListener.callCount, 'GraphModel first listener should have been called twice').to.equal(0);
        expect(secondListener.called, "GraphModel second listener should have been called").to.not.be.ok;
    });
});
