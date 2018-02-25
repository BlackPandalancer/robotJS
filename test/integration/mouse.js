/* jshint esversion: 6 */
var robot = require('../..');
var targetpractice = require('targetpractice/index.js');
var os = require('os');

robot.setMouseDelay(100);

let target, elements;

describe('Integration/Mouse', () => {
	beforeEach(done => {
		target = targetpractice.start();
		target.once('elements', message => {
			elements = message;
			done();
		});
	});

	afterEach(() => {
		targetpractice.stop();
		target = null;
	});

	it('clicks', done => {
		// Alright we got a click event, did we click the button we wanted?
		target.once('click', function(e)
		{
			expect(e.id).toEqual('button_1');
			expect(e.type).toEqual('click');
			done();
		});

		// For this test we want a button.
		var button_1 = elements.button_1;
		// Click it!
		robot.moveMouse(button_1.x, button_1.y);
		robot.mouseClick();
	});

	it('types', done => {
		const stringToType = 'hello world';
		// Currently Target Practice waits for the "user" to finish typing before sending the event.
		target.once('type', element => {
			expect(element.id).toEqual('input_1');
			expect(element.text).toEqual(stringToType);
			done();
		});

		const input_1 = elements.input_1;
		robot.moveMouse(input_1.x, input_1.y);
		robot.mouseClick();
		robot.typeString(stringToType);
	});

	it('scrolls', done => {
		target.once('scroll', element => {
			/**
			 *  TODO: This is gross! The scroll distance is different for each OS. I want
			 *  to look into this further, but at least these numbers are consistent.
			 */
			let expectedScroll;
			switch(os.platform()) {
				case 'linux':
					expectedScroll = 180;
					break;
				case 'win32':
					expectedScroll = 8;
					break;
				default:
					expectedScroll = 10;
			}
			expect(element.id).toEqual('textarea_1');
			expect(element.scroll_y).toEqual(expectedScroll);
			done();
		});

		var textarea_1 = elements.textarea_1;
		robot.moveMouse(textarea_1.x, textarea_1.y);
		robot.mouseClick();
		robot.scrollMouse(0, -10);
	});
});
