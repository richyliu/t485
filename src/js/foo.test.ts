import { Query } from './foo';

it('basic', () => {
	expect(Query.get("q","?q=0")).toBe("0");
});

// it('basic again', () => {
// 	expect(Sum.sum(1, 2, 0)).toBe(3);
// });