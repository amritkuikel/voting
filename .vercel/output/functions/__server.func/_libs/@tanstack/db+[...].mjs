//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/ir.js
var INCLUDES_SCALAR_FIELD = `__includes_scalar__`;
var BaseExpression = class {};
var CollectionRef = class extends BaseExpression {
	constructor(collection, alias) {
		super();
		this.collection = collection;
		this.alias = alias;
		this.type = `collectionRef`;
	}
};
var QueryRef = class extends BaseExpression {
	constructor(query, alias) {
		super();
		this.query = query;
		this.alias = alias;
		this.type = `queryRef`;
	}
};
var UnionFrom = class extends BaseExpression {
	constructor(sources) {
		super();
		this.sources = sources;
		this.type = `unionFrom`;
	}
	get alias() {
		return this.sources[0]?.alias ?? ``;
	}
};
var UnionAll = class extends BaseExpression {
	/**
	* Result-level UNION ALL. Downstream query clauses see the union result row
	* shape, not the branch source aliases. Optimizers may push safe operations
	* into branches, but compiler phases should treat this as a derived relation
	* unless they are explicitly handling branch lowering.
	*/
	constructor(queries) {
		super();
		this.queries = queries;
		this.type = `unionAll`;
	}
	get alias() {
		return ``;
	}
};
var PropRef = class extends BaseExpression {
	constructor(path) {
		super();
		this.path = path;
		this.type = `ref`;
	}
};
var Value = class extends BaseExpression {
	constructor(value) {
		super();
		this.value = value;
		this.type = `val`;
	}
};
var Func = class extends BaseExpression {
	constructor(name, args) {
		super();
		this.name = name;
		this.args = args;
		this.type = `func`;
	}
};
var Aggregate = class extends BaseExpression {
	constructor(name, args) {
		super();
		this.name = name;
		this.args = args;
		this.type = `agg`;
	}
};
var IncludesSubquery = class extends BaseExpression {
	constructor(query, correlationField, childCorrelationField, fieldName, parentFilters, parentProjection, materialization = `collection`, scalarField) {
		super();
		this.query = query;
		this.correlationField = correlationField;
		this.childCorrelationField = childCorrelationField;
		this.fieldName = fieldName;
		this.parentFilters = parentFilters;
		this.parentProjection = parentProjection;
		this.materialization = materialization;
		this.scalarField = scalarField;
		this.type = `includesSubquery`;
	}
};
var ConditionalSelect = class extends BaseExpression {
	constructor(branches, defaultValue) {
		super();
		this.branches = branches;
		this.defaultValue = defaultValue;
		this.type = `conditionalSelect`;
	}
};
function isExpressionLike(value) {
	if (value instanceof Aggregate || value instanceof ConditionalSelect || value instanceof Func || value instanceof PropRef || value instanceof Value || value instanceof IncludesSubquery) return true;
	if (!value || typeof value !== `object`) return false;
	if (value.type === `conditionalSelect`) return Array.isArray(value.branches);
	if (value.type === `agg` || value.type === `func`) return typeof value.name === `string` && Array.isArray(value.args);
	if (value.type === `ref`) return Array.isArray(value.path);
	if (value.type === `val`) return `value` in value;
	if (value.type === `includesSubquery`) return `query` in value && `fieldName` in value;
	return false;
}
function getWhereExpression(where) {
	return typeof where === `object` && `expression` in where ? where.expression : where;
}
function getHavingExpression(having) {
	return typeof having === `object` && `expression` in having ? having.expression : having;
}
function isResidualWhere(where) {
	return typeof where === `object` && `expression` in where && where.residual === true;
}
function createResidualWhere(expression) {
	return {
		expression,
		residual: true
	};
}
function getRefFromAlias(query, alias) {
	if (query.from.type === `unionFrom`) {
		for (const source of query.from.sources) if (source.alias === alias) return source;
	} else if (query.from.type !== `unionAll` && query.from.alias === alias) return query.from;
	for (const join of query.join || []) if (join.from.alias === alias) return join.from;
}
function followRef(query, ref, collection) {
	if (ref.path.length === 0) return;
	if (ref.path.length === 1) {
		const field = ref.path[0];
		if (query.select) {
			const selectedField = query.select[field];
			if (selectedField && selectedField.type === `ref`) return followRef(query, selectedField, collection);
		}
		return {
			collection,
			path: [field]
		};
	}
	if (ref.path.length > 1) {
		const [alias, ...rest] = ref.path;
		const aliasRef = getRefFromAlias(query, alias);
		if (!aliasRef) return;
		if (aliasRef.type === `queryRef`) return followRef(aliasRef.query, new PropRef(rest), collection);
		else return {
			collection: aliasRef.collection,
			path: rest
		};
	}
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/errors.js
var TanStackDBError = class extends Error {
	constructor(message) {
		super(message);
		this.name = `TanStackDBError`;
	}
};
var SchemaValidationError = class extends TanStackDBError {
	constructor(type, issues, message) {
		const defaultMessage = `${type === `insert` ? `Insert` : `Update`} validation failed: ${issues.map((issue) => `
- ${issue.message} - path: ${issue.path}`).join(``)}`;
		super(message || defaultMessage);
		this.name = `SchemaValidationError`;
		this.type = type;
		this.issues = issues;
	}
};
var CollectionConfigurationError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `CollectionConfigurationError`;
	}
};
var CollectionRequiresConfigError = class extends CollectionConfigurationError {
	constructor() {
		super(`Collection requires a config`);
	}
};
var CollectionRequiresSyncConfigError = class extends CollectionConfigurationError {
	constructor() {
		super(`Collection requires a sync config`);
	}
};
var InvalidSchemaError = class extends CollectionConfigurationError {
	constructor() {
		super(`Schema must implement the standard-schema interface`);
	}
};
var SchemaMustBeSynchronousError = class extends CollectionConfigurationError {
	constructor() {
		super(`Schema validation must be synchronous`);
	}
};
var CollectionStateError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `CollectionStateError`;
	}
};
var CollectionInErrorStateError = class extends CollectionStateError {
	constructor(operation, collectionId) {
		super(`Cannot perform ${operation} on collection "${collectionId}" - collection is in error state. Try calling cleanup() and restarting the collection.`);
	}
};
var InvalidCollectionStatusTransitionError = class extends CollectionStateError {
	constructor(from, to, collectionId) {
		super(`Invalid collection status transition from "${from}" to "${to}" for collection "${collectionId}"`);
	}
};
var CollectionIsInErrorStateError = class extends CollectionStateError {
	constructor() {
		super(`Collection is in error state`);
	}
};
var NegativeActiveSubscribersError = class extends CollectionStateError {
	constructor() {
		super(`Active subscribers count is negative - this should never happen`);
	}
};
var CollectionOperationError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `CollectionOperationError`;
	}
};
var UndefinedKeyError = class extends CollectionOperationError {
	constructor(item) {
		super(`An object was created without a defined key: ${JSON.stringify(item)}`);
	}
};
var InvalidKeyError = class extends CollectionOperationError {
	constructor(key, item) {
		super(`getKey returned an invalid key type. Expected string or number, but got ${key === null ? `null` : typeof key}: ${JSON.stringify(key)}. Item: ${JSON.stringify(item)}`);
	}
};
var DuplicateKeyError = class extends CollectionOperationError {
	constructor(key) {
		super(`Cannot insert document with ID "${key}" because it already exists in the collection`);
	}
};
var DuplicateKeySyncError = class extends CollectionOperationError {
	constructor(key, collectionId, options) {
		const baseMessage = `Cannot insert document with key "${key}" from sync because it already exists in the collection "${collectionId}"`;
		if (options?.hasCustomGetKey && options.hasDistinct) super(`${baseMessage}. This collection uses a custom getKey with .distinct(). The .distinct() operator deduplicates by the ENTIRE selected object (standard SQL behavior), but your custom getKey extracts only a subset of fields. This causes multiple distinct rows (with different values in non-key fields) to receive the same key. To fix this, either: (1) ensure your SELECT only includes fields that uniquely identify each row, (2) use .groupBy() with min()/max() aggregates to select one value per group, or (3) remove the custom getKey to use the default key behavior.`);
		else if (options?.hasCustomGetKey && options.hasJoins) super(`${baseMessage}. This collection uses a custom getKey with joined queries. Joined queries can produce multiple rows with the same key when relationships are not 1:1. Consider: (1) using a composite key in your getKey function (e.g., \`\${item.key1}-\${item.key2}\`), (2) ensuring your join produces unique rows per key, or (3) removing the custom getKey to use the default composite key behavior.`);
		else super(baseMessage);
	}
};
var MissingUpdateArgumentError = class extends CollectionOperationError {
	constructor() {
		super(`The first argument to update is missing`);
	}
};
var NoKeysPassedToUpdateError = class extends CollectionOperationError {
	constructor() {
		super(`No keys were passed to update`);
	}
};
var UpdateKeyNotFoundError = class extends CollectionOperationError {
	constructor(key) {
		super(`The key "${key}" was passed to update but an object for this key was not found in the collection`);
	}
};
var KeyUpdateNotAllowedError = class extends CollectionOperationError {
	constructor(originalKey, newKey) {
		super(`Updating the key of an item is not allowed. Original key: "${originalKey}", Attempted new key: "${newKey}". Please delete the old item and create a new one if a key change is necessary.`);
	}
};
var NoKeysPassedToDeleteError = class extends CollectionOperationError {
	constructor() {
		super(`No keys were passed to delete`);
	}
};
var DeleteKeyNotFoundError = class extends CollectionOperationError {
	constructor(key) {
		super(`Collection.delete was called with key '${key}' but there is no item in the collection with this key`);
	}
};
var MissingHandlerError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `MissingHandlerError`;
	}
};
var MissingInsertHandlerError = class extends MissingHandlerError {
	constructor() {
		super(`Collection.insert called directly (not within an explicit transaction) but no 'onInsert' handler is configured.`);
	}
};
var MissingUpdateHandlerError = class extends MissingHandlerError {
	constructor() {
		super(`Collection.update called directly (not within an explicit transaction) but no 'onUpdate' handler is configured.`);
	}
};
var MissingDeleteHandlerError = class extends MissingHandlerError {
	constructor() {
		super(`Collection.delete called directly (not within an explicit transaction) but no 'onDelete' handler is configured.`);
	}
};
var TransactionError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `TransactionError`;
	}
};
var MissingMutationFunctionError = class extends TransactionError {
	constructor() {
		super(`mutationFn is required when creating a transaction`);
	}
};
var TransactionNotPendingMutateError = class extends TransactionError {
	constructor() {
		super(`You can no longer call .mutate() as the transaction is no longer pending`);
	}
};
var TransactionAlreadyCompletedRollbackError = class extends TransactionError {
	constructor() {
		super(`You can no longer call .rollback() as the transaction is already completed`);
	}
};
var TransactionNotPendingCommitError = class extends TransactionError {
	constructor() {
		super(`You can no longer call .commit() as the transaction is no longer pending`);
	}
};
var NoPendingSyncTransactionWriteError = class extends TransactionError {
	constructor() {
		super(`No pending sync transaction to write to`);
	}
};
var SyncTransactionAlreadyCommittedWriteError = class extends TransactionError {
	constructor() {
		super(`The pending sync transaction is already committed, you can't still write to it.`);
	}
};
var NoPendingSyncTransactionCommitError = class extends TransactionError {
	constructor() {
		super(`No pending sync transaction to commit`);
	}
};
var SyncTransactionAlreadyCommittedError = class extends TransactionError {
	constructor() {
		super(`The pending sync transaction is already committed, you can't commit it again.`);
	}
};
var QueryBuilderError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `QueryBuilderError`;
	}
};
var OnlyOneSourceAllowedError = class extends QueryBuilderError {
	constructor(context) {
		super(`Only one source is allowed in the ${context}`);
	}
};
var SubQueryMustHaveFromClauseError = class extends QueryBuilderError {
	constructor(context) {
		super(`A sub query passed to a ${context} must have a from clause itself`);
	}
};
var InvalidSourceError = class extends QueryBuilderError {
	constructor(alias) {
		super(`Invalid source for live query: The value provided for alias "${alias}" is not a Collection or subquery. Live queries only accept Collection instances or subqueries. Please ensure you're passing a valid Collection or QueryBuilder, not a plain array or other data type.`);
	}
};
var InvalidSourceTypeError = class extends QueryBuilderError {
	constructor(context, type) {
		super(`Invalid source for ${context}: Expected ${context === `unionAll clause` ? `an object with one or more key-value pairs like { alias: collection }` : `an object with a single key-value pair like { alias: collection }`}. For example: ${context === `unionAll clause` ? `.unionAll({ todos: todosCollection, events: eventsCollection })` : context === `join clause` ? `.join({ todos: todosCollection }, ({ todo, todos }) => eq(todo.id, todos.id))` : `.from({ todos: todosCollection })`}. Got: ${type}`);
	}
};
var JoinConditionMustBeEqualityError = class extends QueryBuilderError {
	constructor() {
		super(`Join condition must be an equality expression`);
	}
};
var QueryMustHaveFromClauseError = class extends QueryBuilderError {
	constructor() {
		super(`Query must have a from clause`);
	}
};
var InvalidWhereExpressionError = class extends QueryBuilderError {
	constructor(valueType) {
		super(`Invalid where() expression: Expected a query expression, but received a ${valueType}. This usually happens when using JavaScript's comparison operators (===, !==, <, >, etc.) directly. Instead, use the query builder functions:

  ❌ .where(({ user }) => user.id === 'abc')
  ✅ .where(({ user }) => eq(user.id, 'abc'))

Available comparison functions: eq, gt, gte, lt, lte, and, or, not, like, ilike, isNull, isUndefined`);
	}
};
var QueryCompilationError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `QueryCompilationError`;
	}
};
var DistinctRequiresSelectError = class extends QueryCompilationError {
	constructor() {
		super(`DISTINCT requires a SELECT clause.`);
	}
};
var FnSelectWithGroupByError = class extends QueryCompilationError {
	constructor() {
		super(`fn.select() cannot be used with groupBy(). groupBy requires the compiler to statically analyze aggregate functions (count, sum, max, etc.) in the SELECT clause, which is not possible with fn.select() since it is an opaque function. Use .select() instead of .fn.select() when combining with groupBy().`);
	}
};
var UnsupportedRootScalarSelectError = class extends QueryCompilationError {
	constructor() {
		super(`Top-level scalar select() is not supported by createLiveQueryCollection() or queryOnce(). Return an object from .select(), or use the scalar query inside toArray(...) or concat(toArray(...)).`);
	}
};
var HavingRequiresGroupByError = class extends QueryCompilationError {
	constructor() {
		super(`HAVING clause requires GROUP BY clause`);
	}
};
var LimitOffsetRequireOrderByError = class extends QueryCompilationError {
	constructor() {
		super(`LIMIT and OFFSET require an ORDER BY clause to ensure deterministic results`);
	}
};
var CollectionInputNotFoundError = class extends QueryCompilationError {
	constructor(alias, collectionId, availableKeys) {
		const details = collectionId ? `alias "${alias}" (collection "${collectionId}")` : `collection "${alias}"`;
		const availableKeysMsg = availableKeys?.length ? `. Available keys: ${availableKeys.join(`, `)}` : ``;
		super(`Input for ${details} not found in inputs map${availableKeysMsg}`);
	}
};
var DuplicateAliasInSubqueryError = class extends QueryCompilationError {
	constructor(alias, parentAliases) {
		super(`Subquery uses alias "${alias}" which is already used in the parent query. Each alias must be unique across parent and subquery contexts. Parent query aliases: ${parentAliases.join(`, `)}. Please rename "${alias}" in either the parent query or subquery to avoid conflicts.`);
	}
};
var UnsupportedFromTypeError = class extends QueryCompilationError {
	constructor(type) {
		super(`Unsupported FROM type: ${type}`);
	}
};
var UnknownExpressionTypeError = class extends QueryCompilationError {
	constructor(type) {
		super(`Unknown expression type: ${type}`);
	}
};
var EmptyReferencePathError = class extends QueryCompilationError {
	constructor() {
		super(`Reference path cannot be empty`);
	}
};
var UnknownFunctionError = class extends QueryCompilationError {
	constructor(functionName) {
		super(`Unknown function: ${functionName}`);
	}
};
var JoinCollectionNotFoundError = class extends QueryCompilationError {
	constructor(collectionId) {
		super(`Collection "${collectionId}" not found during compilation of join`);
	}
};
var JoinError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `JoinError`;
	}
};
var UnsupportedJoinTypeError = class extends JoinError {
	constructor(joinType) {
		super(`Unsupported join type: ${joinType}`);
	}
};
var InvalidJoinConditionSameSourceError = class extends JoinError {
	constructor(sourceAlias) {
		super(`Invalid join condition: both expressions refer to the same source "${sourceAlias}"`);
	}
};
var InvalidJoinConditionSourceMismatchError = class extends JoinError {
	constructor() {
		super(`Invalid join condition: expressions must reference source aliases`);
	}
};
var InvalidJoinConditionLeftSourceError = class extends JoinError {
	constructor(sourceAlias) {
		super(`Invalid join condition: left expression refers to an unavailable source "${sourceAlias}"`);
	}
};
var InvalidJoinConditionRightSourceError = class extends JoinError {
	constructor(sourceAlias) {
		super(`Invalid join condition: right expression does not refer to the joined source "${sourceAlias}"`);
	}
};
var InvalidJoinCondition = class extends JoinError {
	constructor() {
		super(`Invalid join condition`);
	}
};
var UnsupportedJoinSourceTypeError = class extends JoinError {
	constructor(type) {
		super(`Unsupported join source type: ${type}`);
	}
};
var GroupByError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `GroupByError`;
	}
};
var NonAggregateExpressionNotInGroupByError = class extends GroupByError {
	constructor(alias) {
		super(`Non-aggregate expression '${alias}' in SELECT must also appear in GROUP BY clause`);
	}
};
var UnsupportedAggregateFunctionError = class extends GroupByError {
	constructor(functionName) {
		super(`Unsupported aggregate function: ${functionName}`);
	}
};
var AggregateFunctionNotInSelectError = class extends GroupByError {
	constructor(functionName) {
		super(`Aggregate function in HAVING clause must also be in SELECT clause: ${functionName}`);
	}
};
var UnknownHavingExpressionTypeError = class extends GroupByError {
	constructor(type) {
		super(`Unknown expression type in HAVING clause: ${type}`);
	}
};
var SyncCleanupError = class extends TanStackDBError {
	constructor(collectionId, error) {
		const message = error instanceof Error ? error.message : String(error);
		super(`Collection "${collectionId}" sync cleanup function threw an error: ${message}`);
		this.name = `SyncCleanupError`;
	}
};
var QueryOptimizerError = class extends TanStackDBError {
	constructor(message) {
		super(message);
		this.name = `QueryOptimizerError`;
	}
};
var CannotCombineEmptyExpressionListError = class extends QueryOptimizerError {
	constructor() {
		super(`Cannot combine empty expression list`);
	}
};
var SubscriptionNotFoundError = class extends QueryCompilationError {
	constructor(resolvedAlias, originalAlias, collectionId, availableAliases) {
		super(`Internal error: subscription for alias '${resolvedAlias}' (remapped from '${originalAlias}', collection '${collectionId}') is missing in join pipeline. Available aliases: ${availableAliases.join(`, `)}. This indicates a bug in alias tracking.`);
	}
};
var MissingAliasInputsError = class extends QueryCompilationError {
	constructor(missingAliases) {
		super(`Internal error: compiler returned aliases without inputs: ${missingAliases.join(`, `)}. This indicates a bug in query compilation. Please report this issue.`);
	}
};
var SetWindowRequiresOrderByError = class extends QueryCompilationError {
	constructor() {
		super(`setWindow() can only be called on collections with an ORDER BY clause. Add .orderBy() to your query to enable window movement.`);
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/utils.js
function deepEquals(a, b) {
	return deepEqualsInternal(a, b, /* @__PURE__ */ new Map());
}
function deepEqualsInternal(a, b, visited) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (typeof a !== typeof b) return false;
	if (a instanceof Date) {
		if (!(b instanceof Date)) return false;
		return a.getTime() === b.getTime();
	}
	if (b instanceof Date) return false;
	if (a instanceof RegExp) {
		if (!(b instanceof RegExp)) return false;
		return a.source === b.source && a.flags === b.flags;
	}
	if (b instanceof RegExp) return false;
	if (a instanceof Map) {
		if (!(b instanceof Map)) return false;
		if (a.size !== b.size) return false;
		if (visited.has(a)) return visited.get(a) === b;
		visited.set(a, b);
		const result = Array.from(a.entries()).every(([key, val]) => {
			return b.has(key) && deepEqualsInternal(val, b.get(key), visited);
		});
		visited.delete(a);
		return result;
	}
	if (b instanceof Map) return false;
	if (a instanceof Set) {
		if (!(b instanceof Set)) return false;
		if (a.size !== b.size) return false;
		if (visited.has(a)) return visited.get(a) === b;
		visited.set(a, b);
		const aValues = Array.from(a);
		const bValues = Array.from(b);
		if (aValues.every((val) => typeof val !== `object`)) {
			visited.delete(a);
			return aValues.every((val) => b.has(val));
		}
		const result = aValues.length === bValues.length;
		visited.delete(a);
		return result;
	}
	if (b instanceof Set) return false;
	if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b) && !(a instanceof DataView) && !(b instanceof DataView)) {
		const typedA = a;
		const typedB = b;
		if (typedA.length !== typedB.length) return false;
		for (let i = 0; i < typedA.length; i++) if (typedA[i] !== typedB[i]) return false;
		return true;
	}
	if (ArrayBuffer.isView(b) && !(b instanceof DataView) && !ArrayBuffer.isView(a)) return false;
	if (isTemporal$1(a) && isTemporal$1(b)) {
		if (a[Symbol.toStringTag] !== b[Symbol.toStringTag]) return false;
		if (typeof a.equals === `function`) return a.equals(b);
		return a.toString() === b.toString();
	}
	if (isTemporal$1(b)) return false;
	if (Array.isArray(a)) {
		if (!Array.isArray(b) || a.length !== b.length) return false;
		if (visited.has(a)) return visited.get(a) === b;
		visited.set(a, b);
		const result = a.every((item, index) => deepEqualsInternal(item, b[index], visited));
		visited.delete(a);
		return result;
	}
	if (Array.isArray(b)) return false;
	if (typeof a === `object`) {
		if (visited.has(a)) return visited.get(a) === b;
		visited.set(a, b);
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) {
			visited.delete(a);
			return false;
		}
		const result = keysA.every((key) => key in b && deepEqualsInternal(a[key], b[key], visited));
		visited.delete(a);
		return result;
	}
	return false;
}
var temporalTypes$1 = /* @__PURE__ */ new Set([
	`Temporal.Duration`,
	`Temporal.Instant`,
	`Temporal.PlainDate`,
	`Temporal.PlainDateTime`,
	`Temporal.PlainMonthDay`,
	`Temporal.PlainTime`,
	`Temporal.PlainYearMonth`,
	`Temporal.ZonedDateTime`
]);
function isTemporal$1(a) {
	if (a == null || typeof a !== `object`) return false;
	const tag = a[Symbol.toStringTag];
	return typeof tag === `string` && temporalTypes$1.has(tag);
}
var DEFAULT_COMPARE_OPTIONS = {
	direction: `asc`,
	nulls: `first`,
	stringSort: `locale`
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/utils/comparison.js
var objectIds = /* @__PURE__ */ new WeakMap();
var nextObjectId = 1;
function getObjectId(obj) {
	if (objectIds.has(obj)) return objectIds.get(obj);
	const id = nextObjectId++;
	objectIds.set(obj, id);
	return id;
}
var ascComparator = (a, b, opts) => {
	const { nulls } = opts;
	if (a == null && b == null) return 0;
	if (a == null) return nulls === `first` ? -1 : 1;
	if (b == null) return nulls === `first` ? 1 : -1;
	if (typeof a === `string` && typeof b === `string`) {
		if (opts.stringSort === `locale`) return a.localeCompare(b, opts.locale, opts.localeOptions);
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		for (let i = 0; i < Math.min(a.length, b.length); i++) {
			const result = ascComparator(a[i], b[i], opts);
			if (result !== 0) return result;
		}
		return a.length - b.length;
	}
	if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
	if (isTemporal$1(a) && isTemporal$1(b)) {
		const aStr = a.toString();
		const bStr = b.toString();
		if (aStr < bStr) return -1;
		if (aStr > bStr) return 1;
		return 0;
	}
	const aIsObject = typeof a === `object`;
	const bIsObject = typeof b === `object`;
	if (aIsObject || bIsObject) {
		if (aIsObject && bIsObject) return getObjectId(a) - getObjectId(b);
		if (aIsObject) return 1;
		if (bIsObject) return -1;
	}
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
};
var descComparator = (a, b, opts) => {
	return ascComparator(b, a, {
		...opts,
		nulls: opts.nulls === `first` ? `last` : `first`
	});
};
function makeComparator(opts) {
	return (a, b) => {
		if (opts.direction === `asc`) return ascComparator(a, b, opts);
		else return descComparator(a, b, opts);
	};
}
var defaultComparator = makeComparator({
	direction: `asc`,
	nulls: `first`,
	stringSort: `locale`
});
function areUint8ArraysEqual(a, b) {
	if (a.byteLength !== b.byteLength) return false;
	for (let i = 0; i < a.byteLength; i++) if (a[i] !== b[i]) return false;
	return true;
}
var UINT8ARRAY_NORMALIZE_THRESHOLD = 128;
function normalizeValue(value) {
	if (value instanceof Date) return value.getTime();
	if (isTemporal$1(value)) return `__temporal__${value[Symbol.toStringTag]}__${value.toString()}`;
	if (typeof Buffer !== `undefined` && value instanceof Buffer || value instanceof Uint8Array) {
		if (value.byteLength <= UINT8ARRAY_NORMALIZE_THRESHOLD) return `__u8__${Array.from(value).join(`,`)}`;
	}
	return value;
}
function areValuesEqual(a, b) {
	if (a === b) return true;
	const aIsUint8Array = typeof Buffer !== `undefined` && a instanceof Buffer || a instanceof Uint8Array;
	const bIsUint8Array = typeof Buffer !== `undefined` && b instanceof Buffer || b instanceof Uint8Array;
	if (aIsUint8Array && bIsUint8Array) return areUint8ArraysEqual(a, b);
	return false;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/compiler/evaluators.js
function isUnknown(value) {
	return value === null || value === void 0;
}
function toDateValue(value) {
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	if (typeof value === `string` || typeof value === `number`) {
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}
	return null;
}
function evaluateStrftime(format, date) {
	if (format === `%Y-%m-%d`) return date.toISOString().slice(0, 10);
	if (format === `%Y-%m-%dT%H:%M:%fZ`) return date.toISOString();
	return date.toISOString();
}
function toBooleanPredicate(result) {
	return result === true;
}
function compileExpression(expr, isSingleRow = false) {
	return compileExpressionInternal(expr, isSingleRow);
}
function compileSingleRowExpression(expr) {
	return compileExpressionInternal(expr, true);
}
function compileExpressionInternal(expr, isSingleRow) {
	switch (expr.type) {
		case `val`: {
			const value = expr.value;
			return () => value;
		}
		case `ref`: return isSingleRow ? compileSingleRowRef(expr) : compileRef(expr);
		case `func`: return compileFunction(expr, isSingleRow);
		default: throw new UnknownExpressionTypeError(expr.type);
	}
}
function compileRef(ref) {
	const [namespace, ...propertyPath] = ref.path;
	if (!namespace) throw new EmptyReferencePathError();
	if (namespace === `$selected`) if (propertyPath.length === 0) return (namespacedRow) => namespacedRow.$selected;
	else if (propertyPath.length === 1) {
		const prop = propertyPath[0];
		return (namespacedRow) => {
			return namespacedRow.$selected?.[prop];
		};
	} else return (namespacedRow) => {
		const selectResults = namespacedRow.$selected;
		if (selectResults === void 0) return;
		let value = selectResults;
		for (const prop of propertyPath) {
			if (value == null) return value;
			value = value[prop];
		}
		return value;
	};
	const tableAlias = namespace;
	if (propertyPath.length === 0) return (namespacedRow) => namespacedRow[tableAlias];
	else if (propertyPath.length === 1) {
		const prop = propertyPath[0];
		return (namespacedRow) => {
			return namespacedRow[tableAlias]?.[prop];
		};
	} else return (namespacedRow) => {
		const tableData = namespacedRow[tableAlias];
		if (tableData === void 0) return;
		let value = tableData;
		for (const prop of propertyPath) {
			if (value == null) return value;
			value = value[prop];
		}
		return value;
	};
}
function compileSingleRowRef(ref) {
	const propertyPath = ref.path;
	return (item) => {
		let value = item;
		for (const prop of propertyPath) {
			if (value == null) return value;
			value = value[prop];
		}
		return value;
	};
}
function compileFunction(func, isSingleRow) {
	const compiledArgs = func.args.map((arg) => compileExpressionInternal(arg, isSingleRow));
	switch (func.name) {
		case `eq`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = normalizeValue(argA(data));
				const b = normalizeValue(argB(data));
				if (isUnknown(a) || isUnknown(b)) return null;
				return areValuesEqual(a, b);
			};
		}
		case `gt`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = argA(data);
				const b = argB(data);
				if (isUnknown(a) || isUnknown(b)) return null;
				return a > b;
			};
		}
		case `gte`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = argA(data);
				const b = argB(data);
				if (isUnknown(a) || isUnknown(b)) return null;
				return a >= b;
			};
		}
		case `lt`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = argA(data);
				const b = argB(data);
				if (isUnknown(a) || isUnknown(b)) return null;
				return a < b;
			};
		}
		case `lte`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = argA(data);
				const b = argB(data);
				if (isUnknown(a) || isUnknown(b)) return null;
				return a <= b;
			};
		}
		case `and`: return (data) => {
			let hasUnknown = false;
			for (const compiledArg of compiledArgs) {
				const result = compiledArg(data);
				if (result === false) return false;
				if (isUnknown(result)) hasUnknown = true;
			}
			if (hasUnknown) return null;
			return true;
		};
		case `or`: return (data) => {
			let hasUnknown = false;
			for (const compiledArg of compiledArgs) {
				const result = compiledArg(data);
				if (result === true) return true;
				if (isUnknown(result)) hasUnknown = true;
			}
			if (hasUnknown) return null;
			return false;
		};
		case `not`: {
			const arg = compiledArgs[0];
			return (data) => {
				const result = arg(data);
				if (isUnknown(result)) return null;
				return !result;
			};
		}
		case `in`: {
			const valueEvaluator = compiledArgs[0];
			const arrayEvaluator = compiledArgs[1];
			return (data) => {
				const value = normalizeValue(valueEvaluator(data));
				const array = arrayEvaluator(data);
				if (isUnknown(value)) return null;
				if (!Array.isArray(array)) return false;
				return array.some((item) => normalizeValue(item) === value);
			};
		}
		case `like`: {
			const valueEvaluator = compiledArgs[0];
			const patternEvaluator = compiledArgs[1];
			return (data) => {
				const value = valueEvaluator(data);
				const pattern = patternEvaluator(data);
				if (isUnknown(value) || isUnknown(pattern)) return null;
				return evaluateLike(value, pattern, false);
			};
		}
		case `ilike`: {
			const valueEvaluator = compiledArgs[0];
			const patternEvaluator = compiledArgs[1];
			return (data) => {
				const value = valueEvaluator(data);
				const pattern = patternEvaluator(data);
				if (isUnknown(value) || isUnknown(pattern)) return null;
				return evaluateLike(value, pattern, true);
			};
		}
		case `upper`: {
			const arg = compiledArgs[0];
			return (data) => {
				const value = arg(data);
				return typeof value === `string` ? value.toUpperCase() : value;
			};
		}
		case `lower`: {
			const arg = compiledArgs[0];
			return (data) => {
				const value = arg(data);
				return typeof value === `string` ? value.toLowerCase() : value;
			};
		}
		case `length`: {
			const arg = compiledArgs[0];
			return (data) => {
				const value = arg(data);
				if (typeof value === `string`) return value.length;
				if (Array.isArray(value)) return value.length;
				return 0;
			};
		}
		case `concat`: return (data) => {
			return compiledArgs.map((evaluator) => {
				const arg = evaluator(data);
				try {
					return String(arg ?? ``);
				} catch {
					try {
						return JSON.stringify(arg) || ``;
					} catch {
						return `[object]`;
					}
				}
			}).join(``);
		};
		case `coalesce`: return (data) => {
			for (const evaluator of compiledArgs) {
				const value = evaluator(data);
				if (value !== null && value !== void 0) return value;
			}
			return null;
		};
		case `caseWhen`: {
			const hasDefaultValue = compiledArgs.length % 2 === 1;
			const pairCount = Math.floor(compiledArgs.length / 2);
			if (compiledArgs.length < 2) throw new Error(`caseWhen() requires at least two arguments`);
			return (data) => {
				for (let i = 0; i < pairCount; i++) {
					const condition = compiledArgs[i * 2];
					if (isCaseWhenConditionTrue(condition(data))) {
						const value = compiledArgs[i * 2 + 1];
						return value(data);
					}
				}
				if (hasDefaultValue) return compiledArgs[compiledArgs.length - 1](data);
				return null;
			};
		}
		case `add`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = argA(data);
				const b = argB(data);
				return (a ?? 0) + (b ?? 0);
			};
		}
		case `subtract`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = argA(data);
				const b = argB(data);
				return (a ?? 0) - (b ?? 0);
			};
		}
		case `multiply`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = argA(data);
				const b = argB(data);
				return (a ?? 0) * (b ?? 0);
			};
		}
		case `divide`: {
			const argA = compiledArgs[0];
			const argB = compiledArgs[1];
			return (data) => {
				const a = argA(data);
				const divisor = argB(data) ?? 0;
				return divisor !== 0 ? (a ?? 0) / divisor : null;
			};
		}
		case `date`: {
			const arg = compiledArgs[0];
			return (data) => {
				const dateValue = toDateValue(arg(data));
				return dateValue ? dateValue.toISOString().slice(0, 10) : null;
			};
		}
		case `datetime`: {
			const arg = compiledArgs[0];
			return (data) => {
				const dateValue = toDateValue(arg(data));
				return dateValue ? dateValue.toISOString() : null;
			};
		}
		case `strftime`: {
			const formatArg = compiledArgs[0];
			const sourceArg = compiledArgs[1];
			return (data) => {
				const format = formatArg(data);
				if (typeof format !== `string`) return null;
				const dateValue = toDateValue(sourceArg(data));
				if (!dateValue) return null;
				return evaluateStrftime(format, dateValue);
			};
		}
		case `isUndefined`: {
			const arg = compiledArgs[0];
			return (data) => {
				return arg(data) === void 0;
			};
		}
		case `isNull`: {
			const arg = compiledArgs[0];
			return (data) => {
				return arg(data) === null;
			};
		}
		default: throw new UnknownFunctionError(func.name);
	}
}
function isCaseWhenConditionTrue(value) {
	if (value == null || value === false) return false;
	if (value === true) return true;
	if (typeof value === `number`) return value !== 0 && !Number.isNaN(value);
	if (typeof value === `bigint`) return value !== 0n;
	return Boolean(value);
}
function evaluateLike(value, pattern, caseInsensitive) {
	if (typeof value !== `string` || typeof pattern !== `string`) return false;
	const searchValue = caseInsensitive ? value.toLowerCase() : value;
	let regexPattern = (caseInsensitive ? pattern.toLowerCase() : pattern).replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
	regexPattern = regexPattern.replace(/%/g, `.*`);
	regexPattern = regexPattern.replace(/_/g, `.`);
	return new RegExp(`^${regexPattern}$`, "s").test(searchValue);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/indexes/reverse-index.js
var ReverseIndex = class {
	constructor(index) {
		this.originalIndex = index;
	}
	lookup(operation, value) {
		const reverseOperation = operation === `gt` ? `lt` : operation === `gte` ? `lte` : operation === `lt` ? `gt` : operation === `lte` ? `gte` : operation;
		return this.originalIndex.lookup(reverseOperation, value);
	}
	rangeQuery(options = {}) {
		return this.originalIndex.rangeQueryReversed(options);
	}
	rangeQueryReversed(options = {}) {
		return this.originalIndex.rangeQuery(options);
	}
	take(n, from, filterFn) {
		return this.originalIndex.takeReversed(n, from, filterFn);
	}
	takeFromStart(n, filterFn) {
		return this.originalIndex.takeReversedFromEnd(n, filterFn);
	}
	takeReversed(n, from, filterFn) {
		return this.originalIndex.take(n, from, filterFn);
	}
	takeReversedFromEnd(n, filterFn) {
		return this.originalIndex.takeFromStart(n, filterFn);
	}
	get orderedEntriesArray() {
		return this.originalIndex.orderedEntriesArrayReversed;
	}
	get orderedEntriesArrayReversed() {
		return this.originalIndex.orderedEntriesArray;
	}
	supports(operation) {
		return this.originalIndex.supports(operation);
	}
	matchesField(fieldPath) {
		return this.originalIndex.matchesField(fieldPath);
	}
	matchesCompareOptions(compareOptions) {
		return this.originalIndex.matchesCompareOptions(compareOptions);
	}
	matchesDirection(direction) {
		return this.originalIndex.matchesDirection(direction);
	}
	getStats() {
		return this.originalIndex.getStats();
	}
	add(key, item) {
		this.originalIndex.add(key, item);
	}
	remove(key, item) {
		this.originalIndex.remove(key, item);
	}
	update(key, oldItem, newItem) {
		this.originalIndex.update(key, oldItem, newItem);
	}
	build(entries) {
		this.originalIndex.build(entries);
	}
	clear() {
		this.originalIndex.clear();
	}
	get keyCount() {
		return this.originalIndex.keyCount;
	}
	equalityLookup(value) {
		return this.originalIndex.equalityLookup(value);
	}
	inArrayLookup(values) {
		return this.originalIndex.inArrayLookup(values);
	}
	get indexedKeysSet() {
		return this.originalIndex.indexedKeysSet;
	}
	get valueMapData() {
		return this.originalIndex.valueMapData;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/virtual-props.js
function enrichRowWithVirtualProps(row, key, collectionId, computeSynced, computeOrigin) {
	const existingRow = row;
	return {
		...row,
		$synced: existingRow.$synced ?? computeSynced(),
		$origin: existingRow.$origin ?? computeOrigin(),
		$key: existingRow.$key ?? key,
		$collectionId: existingRow.$collectionId ?? collectionId
	};
}
var VIRTUAL_PROP_NAMES = [
	"$synced",
	"$origin",
	"$key",
	"$collectionId"
];
function isVirtualPropName(name) {
	return VIRTUAL_PROP_NAMES.includes(name);
}
function hasVirtualPropPath(path) {
	return path.some((segment) => isVirtualPropName(segment));
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/utils/index-optimization.js
function findIndexForField(collection, fieldPath, compareOptions) {
	if (hasVirtualPropPath(fieldPath)) return;
	const compareOpts = compareOptions ?? {
		...DEFAULT_COMPARE_OPTIONS,
		...collection.compareOptions
	};
	for (const index of collection.indexes.values()) if (index.matchesField(fieldPath) && index.matchesCompareOptions(compareOpts)) {
		if (!index.matchesDirection(compareOpts.direction)) return new ReverseIndex(index);
		return index;
	}
}
function intersectSets(sets) {
	if (sets.length === 0) return /* @__PURE__ */ new Set();
	if (sets.length === 1) return new Set(sets[0]);
	let result = new Set(sets[0]);
	for (let i = 1; i < sets.length; i++) {
		const newResult = /* @__PURE__ */ new Set();
		for (const item of result) if (sets[i].has(item)) newResult.add(item);
		result = newResult;
	}
	return result;
}
function unionSets(sets) {
	const result = /* @__PURE__ */ new Set();
	for (const set of sets) for (const item of set) result.add(item);
	return result;
}
function optimizeExpressionWithIndexes(expression, collection) {
	return optimizeQueryRecursive(expression, collection);
}
function optimizeQueryRecursive(expression, collection) {
	if (expression.type === `func`) switch (expression.name) {
		case `eq`:
		case `gt`:
		case `gte`:
		case `lt`:
		case `lte`: return optimizeSimpleComparison(expression, collection);
		case `and`: return optimizeAndExpression(expression, collection);
		case `or`: return optimizeOrExpression(expression, collection);
		case `in`: return optimizeInArrayExpression(expression, collection);
	}
	return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
}
function optimizeCompoundRangeQuery(expression, collection) {
	if (expression.type !== `func` || expression.args.length < 2) return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
	const fieldOperations = /* @__PURE__ */ new Map();
	for (const arg of expression.args) if (arg.type === `func` && [
		`gt`,
		`gte`,
		`lt`,
		`lte`
	].includes(arg.name)) {
		const rangeOp = arg;
		if (rangeOp.args.length === 2) {
			const leftArg = rangeOp.args[0];
			const rightArg = rangeOp.args[1];
			let fieldArg = null;
			let valueArg = null;
			let operation = rangeOp.name;
			if (leftArg.type === `ref` && rightArg.type === `val`) {
				fieldArg = leftArg;
				valueArg = rightArg;
			} else if (leftArg.type === `val` && rightArg.type === `ref`) {
				fieldArg = rightArg;
				valueArg = leftArg;
				switch (operation) {
					case `gt`:
						operation = `lt`;
						break;
					case `gte`:
						operation = `lte`;
						break;
					case `lt`:
						operation = `gt`;
						break;
					case `lte`:
						operation = `gte`;
						break;
				}
			}
			if (fieldArg && valueArg) {
				const fieldKey = fieldArg.path.join(`.`);
				const value = valueArg.value;
				if (!fieldOperations.has(fieldKey)) fieldOperations.set(fieldKey, []);
				fieldOperations.get(fieldKey).push({
					operation,
					value
				});
			}
		}
	}
	for (const [fieldKey, operations] of fieldOperations) if (operations.length >= 2) {
		const index = findIndexForField(collection, fieldKey.split(`.`));
		if (index && index.supports(`gt`) && index.supports(`lt`)) {
			let from = void 0;
			let to = void 0;
			let fromInclusive = true;
			let toInclusive = true;
			for (const { operation, value } of operations) switch (operation) {
				case `gt`:
					if (from === void 0 || value > from) {
						from = value;
						fromInclusive = false;
					}
					break;
				case `gte`:
					if (from === void 0 || value > from) {
						from = value;
						fromInclusive = true;
					}
					break;
				case `lt`:
					if (to === void 0 || value < to) {
						to = value;
						toInclusive = false;
					}
					break;
				case `lte`:
					if (to === void 0 || value < to) {
						to = value;
						toInclusive = true;
					}
					break;
			}
			return {
				canOptimize: true,
				matchingKeys: index.rangeQuery({
					from,
					to,
					fromInclusive,
					toInclusive
				})
			};
		}
	}
	return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
}
function optimizeSimpleComparison(expression, collection) {
	if (expression.type !== `func` || expression.args.length !== 2) return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
	const leftArg = expression.args[0];
	const rightArg = expression.args[1];
	let fieldArg = null;
	let valueArg = null;
	let operation = expression.name;
	if (leftArg.type === `ref` && rightArg.type === `val`) {
		fieldArg = leftArg;
		valueArg = rightArg;
	} else if (leftArg.type === `val` && rightArg.type === `ref`) {
		fieldArg = rightArg;
		valueArg = leftArg;
		switch (operation) {
			case `gt`:
				operation = `lt`;
				break;
			case `gte`:
				operation = `lte`;
				break;
			case `lt`:
				operation = `gt`;
				break;
			case `lte`:
				operation = `gte`;
				break;
		}
	}
	if (fieldArg && valueArg) {
		const fieldPath = fieldArg.path;
		const index = findIndexForField(collection, fieldPath);
		if (index) {
			const queryValue = valueArg.value;
			const indexOperation = operation;
			if (!index.supports(indexOperation)) return {
				canOptimize: false,
				matchingKeys: /* @__PURE__ */ new Set()
			};
			return {
				canOptimize: true,
				matchingKeys: index.lookup(indexOperation, queryValue)
			};
		}
	}
	return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
}
function optimizeAndExpression(expression, collection) {
	if (expression.type !== `func` || expression.args.length < 2) return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
	const compoundRangeResult = optimizeCompoundRangeQuery(expression, collection);
	if (compoundRangeResult.canOptimize) return compoundRangeResult;
	const results = [];
	for (const arg of expression.args) {
		const result = optimizeQueryRecursive(arg, collection);
		if (result.canOptimize) results.push(result);
	}
	if (results.length > 0) return {
		canOptimize: true,
		matchingKeys: intersectSets(results.map((r) => r.matchingKeys))
	};
	return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
}
function optimizeOrExpression(expression, collection) {
	if (expression.type !== `func` || expression.args.length < 2) return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
	const results = [];
	for (const arg of expression.args) {
		const result = optimizeQueryRecursive(arg, collection);
		if (result.canOptimize) results.push(result);
	}
	if (results.length > 0) return {
		canOptimize: true,
		matchingKeys: unionSets(results.map((r) => r.matchingKeys))
	};
	return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
}
function optimizeInArrayExpression(expression, collection) {
	if (expression.type !== `func` || expression.args.length !== 2) return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
	const fieldArg = expression.args[0];
	const arrayArg = expression.args[1];
	if (fieldArg.type === `ref` && arrayArg.type === `val` && Array.isArray(arrayArg.value)) {
		const fieldPath = fieldArg.path;
		const values = arrayArg.value;
		const index = findIndexForField(collection, fieldPath);
		if (index) {
			if (index.supports(`in`)) return {
				canOptimize: true,
				matchingKeys: index.lookup(`in`, values)
			};
			else if (index.supports(`eq`)) {
				const matchingKeys = /* @__PURE__ */ new Set();
				for (const value of values) {
					const keysForValue = index.lookup(`eq`, value);
					for (const key of keysForValue) matchingKeys.add(key);
				}
				return {
					canOptimize: true,
					matchingKeys
				};
			}
		}
	}
	return {
		canOptimize: false,
		matchingKeys: /* @__PURE__ */ new Set()
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/indexes/index-registry.js
var devModeConfig = {
	enabled: true,
	collectionSizeThreshold: 1e3,
	slowQueryThresholdMs: 10,
	onSuggestion: null
};
function isDevModeEnabled() {
	return devModeConfig.enabled && false;
}
function emitIndexSuggestion(suggestion) {
	if (!isDevModeEnabled()) return;
	if (devModeConfig.onSuggestion) try {
		devModeConfig.onSuggestion(suggestion);
	} catch {}
	else console.warn(`[TanStack DB] Index suggestion for "${suggestion.collectionId}":
  ${suggestion.message}
  Field: ${suggestion.fieldPath.join(`.`)}
  Add index: collection.createIndex((row) => row.${suggestion.fieldPath.join(`.`)})`);
}
function checkCollectionSizeForIndex(collectionId, collectionSize, fieldPath) {
	if (!isDevModeEnabled()) return;
	if (collectionSize > devModeConfig.collectionSizeThreshold) emitIndexSuggestion({
		type: `collection-size`,
		collectionId,
		fieldPath,
		message: `Collection has ${collectionSize} items. Queries on "${fieldPath.join(`.`)}" may benefit from an index.`,
		collectionSize
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/indexes/auto-index.js
function shouldAutoIndex(collection) {
	return collection.config.autoIndex === `eager`;
}
function ensureIndexForField(fieldName, fieldPath, collection, compareOptions, compareFn) {
	if (hasVirtualPropPath(fieldPath)) return;
	if (!shouldAutoIndex(collection)) return;
	const compareOpts = compareOptions ?? {
		...DEFAULT_COMPARE_OPTIONS,
		...collection.compareOptions
	};
	if (Array.from(collection.indexes.values()).find((index) => index.matchesField(fieldPath) && index.matchesCompareOptions(compareOpts))) return;
	if (isDevModeEnabled()) checkCollectionSizeForIndex(collection.id || `unknown`, collection.size, fieldPath);
	try {
		collection.createIndex((row) => {
			let current = row;
			for (const part of fieldPath) current = current[part];
			return current;
		}, {
			name: `auto:${fieldPath.join(`.`)}`,
			options: compareFn ? {
				compareFn,
				compareOptions: compareOpts
			} : {}
		});
	} catch (error) {
		console.warn(`${collection.id ? `[${collection.id}] ` : ``}Failed to create auto-index for field path "${fieldPath.join(`.`)}":`, error);
	}
}
function ensureIndexForExpression(expression, collection) {
	if (!shouldAutoIndex(collection)) return;
	const indexableExpressions = extractIndexableExpressions(expression);
	for (const { fieldName, fieldPath } of indexableExpressions) ensureIndexForField(fieldName, fieldPath, collection);
}
function extractIndexableExpressions(expression) {
	const results = [];
	function extractFromExpression(expr) {
		if (expr.type !== `func`) return;
		const func = expr;
		if (func.name === `and`) {
			for (const arg of func.args) extractFromExpression(arg);
			return;
		}
		if (![
			`eq`,
			`gt`,
			`gte`,
			`lt`,
			`lte`,
			`in`
		].includes(func.name)) return;
		if (func.args.length < 1 || func.args[0].type !== `ref`) return;
		const fieldPath = func.args[0].path;
		if (fieldPath.length === 0) return;
		const fieldName = fieldPath.join(`_`);
		results.push({
			fieldName,
			fieldPath
		});
	}
	extractFromExpression(expression);
	return results;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/utils.js
var DefaultMap = class extends Map {
	constructor(defaultValue, entries) {
		super(entries);
		this.defaultValue = defaultValue;
	}
	get(key) {
		if (!this.has(key)) return this.defaultValue();
		return super.get(key);
	}
	/**
	* Update the value for a key using a function.
	*/
	update(key, updater) {
		const newValue = updater(this.get(key));
		this.set(key, newValue);
		return newValue;
	}
};
var chunkSize = 3e4;
function chunkedArrayPush(array, other) {
	if (other.length <= chunkSize) array.push(...other);
	else for (let i = 0; i < other.length; i += chunkSize) {
		const chunk = other.slice(i, i + chunkSize);
		array.push(...chunk);
	}
}
function binarySearch(array, value, comparator) {
	let low = 0;
	let high = array.length;
	while (low < high) {
		const mid = Math.floor((low + high) / 2);
		const comparison = comparator(array[mid], value);
		if (comparison < 0) low = mid + 1;
		else if (comparison > 0) high = mid;
		else return mid;
	}
	return low;
}
var ObjectIdGenerator = class {
	constructor() {
		this.objectIds = /* @__PURE__ */ new WeakMap();
		this.nextId = 0;
	}
	/**
	* Get a unique identifier for any value.
	* - Objects: Uses WeakMap for reference-based identity
	* - Primitives: Uses consistent string-based hashing
	*/
	getId(value) {
		if (typeof value !== `object` || value === null) {
			const str = String(value);
			let hashValue = 0;
			for (let i = 0; i < str.length; i++) {
				const char = str.charCodeAt(i);
				hashValue = (hashValue << 5) - hashValue + char;
				hashValue = hashValue & hashValue;
			}
			return hashValue;
		}
		if (!this.objectIds.has(value)) this.objectIds.set(value, this.nextId++);
		return this.objectIds.get(value);
	}
	/**
	* Get a string representation of the ID for use in composite keys.
	*/
	getStringId(value) {
		if (value === null) return `null`;
		if (value === void 0) return `undefined`;
		if (typeof value !== `object`) return `str_${String(value)}`;
		return `obj_${this.getId(value)}`;
	}
};
var globalObjectIdGenerator = new ObjectIdGenerator();
function diffHalfOpen(a, b) {
	const [a1, a2] = a;
	const [b1, b2] = b;
	return {
		onlyInA: [...range(a1, Math.min(a2, b1)), ...range(Math.max(a1, b2), a2)],
		onlyInB: [...range(b1, Math.min(b2, a1)), ...range(Math.max(b1, a2), b2)]
	};
}
function range(start, end) {
	const out = [];
	for (let i = start; i < end; i++) out.push(i);
	return out;
}
function compareKeys(a, b) {
	if (typeof a === typeof b) {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	}
	return typeof a === `string` ? -1 : 1;
}
function serializeValue(value) {
	return JSON.stringify(value, (_, val) => {
		if (typeof val === "bigint") return val.toString();
		if (val instanceof Date) return val.toISOString();
		return val;
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/hashing/murmur.js
var RANDOM_SEED = randomHash();
var STRING_MARKER = randomHash();
var BIG_INT_MARKER = randomHash();
var NEG_BIG_INT_MARKER = randomHash();
var SYMBOL_MARKER = randomHash();
function randomHash() {
	return Math.random() * (2 ** 31 - 1) >>> 0;
}
var buf = /* @__PURE__ */ new ArrayBuffer(8);
var dv = new DataView(buf);
var u8 = new Uint8Array(buf);
var MurmurHashStream = class {
	constructor() {
		this.hash = RANDOM_SEED;
		this.length = 0;
		this.carry = 0;
		this.carryBytes = 0;
	}
	_mix(k1) {
		k1 = Math.imul(k1, 3432918353);
		k1 = k1 << 15 | k1 >>> 17;
		k1 = Math.imul(k1, 461845907);
		this.hash ^= k1;
		this.hash = this.hash << 13 | this.hash >>> 19;
		this.hash = Math.imul(this.hash, 5) + 3864292196;
	}
	writeByte(byte) {
		this.carry |= (byte & 255) << 8 * this.carryBytes;
		this.carryBytes++;
		this.length++;
		if (this.carryBytes === 4) {
			this._mix(this.carry >>> 0);
			this.carry = 0;
			this.carryBytes = 0;
		}
	}
	update(chunk) {
		switch (typeof chunk) {
			case `symbol`: {
				this.update(SYMBOL_MARKER);
				const description = chunk.description;
				if (!description) return;
				for (let i = 0; i < description.length; i++) {
					const code = description.charCodeAt(i);
					this.writeByte(code & 255);
					this.writeByte(code >>> 8 & 255);
				}
				return;
			}
			case `string`:
				this.update(STRING_MARKER);
				for (let i = 0; i < chunk.length; i++) {
					const code = chunk.charCodeAt(i);
					this.writeByte(code & 255);
					this.writeByte(code >>> 8 & 255);
				}
				return;
			case `number`:
				dv.setFloat64(0, chunk, true);
				this.writeByte(u8[0]);
				this.writeByte(u8[1]);
				this.writeByte(u8[2]);
				this.writeByte(u8[3]);
				this.writeByte(u8[4]);
				this.writeByte(u8[5]);
				this.writeByte(u8[6]);
				this.writeByte(u8[7]);
				return;
			case `bigint`: {
				let value = chunk;
				if (value < 0n) {
					value = -value;
					this.update(NEG_BIG_INT_MARKER);
				} else this.update(BIG_INT_MARKER);
				while (value > 0n) {
					this.writeByte(Number(value & 255n));
					value >>= 8n;
				}
				if (chunk === 0n) this.writeByte(0);
				return;
			}
			default: throw new TypeError(`Unsupported input type: ${typeof chunk}`);
		}
	}
	digest() {
		if (this.carryBytes > 0) {
			let k1 = this.carry >>> 0;
			k1 = Math.imul(k1, 3432918353);
			k1 = k1 << 15 | k1 >>> 17;
			k1 = Math.imul(k1, 461845907);
			this.hash ^= k1;
		}
		this.hash ^= this.length;
		this.hash ^= this.hash >>> 16;
		this.hash = Math.imul(this.hash, 2246822507);
		this.hash ^= this.hash >>> 13;
		this.hash = Math.imul(this.hash, 3266489909);
		this.hash ^= this.hash >>> 16;
		return this.hash >>> 0;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/hashing/hash.js
var TRUE = randomHash();
var FALSE = randomHash();
var NULL = randomHash();
var UNDEFINED = randomHash();
var KEY = randomHash();
var FUNCTIONS = randomHash();
var DATE_MARKER = randomHash();
var OBJECT_MARKER = randomHash();
var ARRAY_MARKER = randomHash();
var MAP_MARKER = randomHash();
var SET_MARKER = randomHash();
var UINT8ARRAY_MARKER = randomHash();
var TEMPORAL_MARKER = randomHash();
var temporalTypes = /* @__PURE__ */ new Set([
	`Temporal.Duration`,
	`Temporal.Instant`,
	`Temporal.PlainDate`,
	`Temporal.PlainDateTime`,
	`Temporal.PlainMonthDay`,
	`Temporal.PlainTime`,
	`Temporal.PlainYearMonth`,
	`Temporal.ZonedDateTime`
]);
function isTemporal(input) {
	const tag = input[Symbol.toStringTag];
	return typeof tag === `string` && temporalTypes.has(tag);
}
var UINT8ARRAY_CONTENT_HASH_THRESHOLD = 128;
var hashCache = /* @__PURE__ */ new WeakMap();
function hash(input) {
	const hasher = new MurmurHashStream();
	updateHasher(hasher, input);
	return hasher.digest();
}
function hashObject(input) {
	const cachedHash = hashCache.get(input);
	if (cachedHash !== void 0) return cachedHash;
	let valueHash;
	if (input instanceof Date) valueHash = hashDate(input);
	else if (typeof Buffer !== `undefined` && input instanceof Buffer || input instanceof Uint8Array) if (input.byteLength <= UINT8ARRAY_CONTENT_HASH_THRESHOLD) valueHash = hashUint8Array(input);
	else return cachedReferenceHash(input);
	else if (input instanceof File) return cachedReferenceHash(input);
	else if (isTemporal(input)) valueHash = hashTemporal(input);
	else {
		let plainObjectInput = input;
		let marker = OBJECT_MARKER;
		if (input instanceof Array) marker = ARRAY_MARKER;
		if (input instanceof Map) {
			marker = MAP_MARKER;
			plainObjectInput = [...input.entries()];
		}
		if (input instanceof Set) {
			marker = SET_MARKER;
			plainObjectInput = [...input.entries()];
		}
		valueHash = hashPlainObject(plainObjectInput, marker);
	}
	hashCache.set(input, valueHash);
	return valueHash;
}
function hashDate(input) {
	const hasher = new MurmurHashStream();
	hasher.update(DATE_MARKER);
	hasher.update(input.getTime());
	return hasher.digest();
}
function hashUint8Array(input) {
	const hasher = new MurmurHashStream();
	hasher.update(UINT8ARRAY_MARKER);
	hasher.update(input.byteLength);
	for (let i = 0; i < input.byteLength; i++) hasher.writeByte(input[i]);
	return hasher.digest();
}
function hashTemporal(input) {
	const hasher = new MurmurHashStream();
	hasher.update(TEMPORAL_MARKER);
	hasher.update(input[Symbol.toStringTag]);
	hasher.update(input.toString());
	return hasher.digest();
}
function hashPlainObject(input, marker) {
	const hasher = new MurmurHashStream();
	hasher.update(marker);
	const keys = Object.keys(input);
	keys.sort(keySort);
	for (const key of keys) {
		hasher.update(KEY);
		hasher.update(key);
		updateHasher(hasher, input[key]);
	}
	return hasher.digest();
}
function updateHasher(hasher, input) {
	if (input === null) {
		hasher.update(NULL);
		return;
	}
	switch (typeof input) {
		case `undefined`:
			hasher.update(UNDEFINED);
			return;
		case `boolean`:
			hasher.update(input ? TRUE : FALSE);
			return;
		case `number`:
			hasher.update(isNaN(input) ? NaN : input === 0 ? 0 : input);
			return;
		case `bigint`:
		case `string`:
		case `symbol`:
			hasher.update(input);
			return;
		case `object`:
			hasher.update(getCachedHash(input));
			return;
		case `function`:
			hasher.update(cachedReferenceHash(input));
			return;
		default: console.warn(`Ignored input during hashing because it is of type ${typeof input} which is not supported`);
	}
}
function getCachedHash(input) {
	let valueHash = hashCache.get(input);
	if (valueHash === void 0) valueHash = hashObject(input);
	return valueHash;
}
var nextRefId = 1;
function cachedReferenceHash(fn) {
	let valueHash = hashCache.get(fn);
	if (valueHash === void 0) {
		valueHash = nextRefId ^ FUNCTIONS;
		nextRefId++;
		hashCache.set(fn, valueHash);
	}
	return valueHash;
}
function keySort(a, b) {
	return a.localeCompare(b);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/multiset.js
var MultiSet = class MultiSet {
	#inner;
	constructor(data = []) {
		this.#inner = data;
	}
	toString(indent = false) {
		return `MultiSet(${JSON.stringify(this.#inner, null, indent ? 2 : void 0)})`;
	}
	toJSON() {
		return JSON.stringify(Array.from(this.getInner()));
	}
	static fromJSON(json) {
		return new MultiSet(JSON.parse(json));
	}
	/**
	* Apply a function to all records in the collection.
	*/
	map(f) {
		return new MultiSet(this.#inner.map(([data, multiplicity]) => [f(data), multiplicity]));
	}
	/**
	* Filter out records for which a function f(record) evaluates to False.
	*/
	filter(f) {
		return new MultiSet(this.#inner.filter(([data, _]) => f(data)));
	}
	/**
	* Negate all multiplicities in the collection.
	*/
	negate() {
		return new MultiSet(this.#inner.map(([data, multiplicity]) => [data, -multiplicity]));
	}
	/**
	* Concatenate two collections together.
	*/
	concat(other) {
		const out = [];
		chunkedArrayPush(out, this.#inner);
		chunkedArrayPush(out, other.getInner());
		return new MultiSet(out);
	}
	/**
	* Produce as output a collection that is logically equivalent to the input
	* but which combines identical instances of the same record into one
	* (record, multiplicity) pair.
	*/
	consolidate() {
		if (this.#inner.length > 0) {
			const firstItem = this.#inner[0]?.[0];
			if (Array.isArray(firstItem) && firstItem.length === 2) return this.#consolidateKeyed();
		}
		return this.#consolidateUnkeyed();
	}
	/**
	* Private method for consolidating keyed multisets where keys are strings/numbers
	* and values are compared by reference equality.
	*
	* This method provides significant performance improvements over the hash-based approach
	* by using WeakMap for object reference tracking and avoiding expensive serialization.
	*
	* Special handling for join operations: When values are tuples of length 2 (common in joins),
	* we unpack them and compare each element individually to maintain proper equality semantics.
	*/
	#consolidateKeyed() {
		const consolidated = /* @__PURE__ */ new Map();
		const values = /* @__PURE__ */ new Map();
		const getTupleId = (tuple) => {
			if (tuple.length !== 2) throw new Error(`Expected tuple of length 2`);
			const [first, second] = tuple;
			return `${globalObjectIdGenerator.getStringId(first)}|${globalObjectIdGenerator.getStringId(second)}`;
		};
		for (const [data, multiplicity] of this.#inner) {
			if (!Array.isArray(data) || data.length !== 2) return this.#consolidateUnkeyed();
			const [key, value] = data;
			if (typeof key !== `string` && typeof key !== `number`) return this.#consolidateUnkeyed();
			let valueId;
			if (Array.isArray(value) && value.length === 2) valueId = getTupleId(value);
			else valueId = globalObjectIdGenerator.getStringId(value);
			const compositeKey = key + `|` + valueId;
			consolidated.set(compositeKey, (consolidated.get(compositeKey) || 0) + multiplicity);
			if (!values.has(compositeKey)) values.set(compositeKey, data);
		}
		const result = [];
		for (const [compositeKey, multiplicity] of consolidated) if (multiplicity !== 0) result.push([values.get(compositeKey), multiplicity]);
		return new MultiSet(result);
	}
	/**
	* Private method for consolidating unkeyed multisets using the original approach.
	*/
	#consolidateUnkeyed() {
		const consolidated = new DefaultMap(() => 0);
		const values = /* @__PURE__ */ new Map();
		let hasString = false;
		let hasNumber = false;
		let hasOther = false;
		for (const [data, _] of this.#inner) if (typeof data === `string`) hasString = true;
		else if (typeof data === `number`) hasNumber = true;
		else {
			hasOther = true;
			break;
		}
		const requireJson = hasOther || hasString && hasNumber;
		for (const [data, multiplicity] of this.#inner) {
			const key = requireJson ? hash(data) : data;
			if (requireJson && !values.has(key)) values.set(key, data);
			consolidated.update(key, (count) => count + multiplicity);
		}
		const result = [];
		for (const [key, multiplicity] of consolidated.entries()) if (multiplicity !== 0) {
			const parsedKey = requireJson ? values.get(key) : key;
			result.push([parsedKey, multiplicity]);
		}
		return new MultiSet(result);
	}
	extend(other) {
		const otherArray = other instanceof MultiSet ? other.getInner() : other;
		chunkedArrayPush(this.#inner, otherArray);
	}
	add(item, multiplicity) {
		if (multiplicity !== 0) this.#inner.push([item, multiplicity]);
	}
	getInner() {
		return this.#inner;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/graph.js
var DifferenceStreamReader = class {
	#queue;
	constructor(queue) {
		this.#queue = queue;
	}
	drain() {
		const out = [...this.#queue].reverse();
		this.#queue.length = 0;
		return out;
	}
	isEmpty() {
		return this.#queue.length === 0;
	}
};
var DifferenceStreamWriter = class {
	#queues = [];
	sendData(collection) {
		if (!(collection instanceof MultiSet)) collection = new MultiSet(collection);
		for (const q of this.#queues) q.unshift(collection);
	}
	newReader() {
		const q = [];
		this.#queues.push(q);
		return new DifferenceStreamReader(q);
	}
};
var Operator = class {
	constructor(id, inputs, output) {
		this.id = id;
		this.inputs = inputs;
		this.output = output;
	}
	hasPendingWork() {
		return this.inputs.some((input) => !input.isEmpty());
	}
};
var UnaryOperator = class extends Operator {
	constructor(id, inputA, output) {
		super(id, [inputA], output);
		this.id = id;
	}
	inputMessages() {
		return this.inputs[0].drain();
	}
};
var BinaryOperator = class extends Operator {
	constructor(id, inputA, inputB, output) {
		super(id, [inputA, inputB], output);
		this.id = id;
	}
	inputAMessages() {
		return this.inputs[0].drain();
	}
	inputBMessages() {
		return this.inputs[1].drain();
	}
};
var LinearUnaryOperator = class extends UnaryOperator {
	run() {
		for (const message of this.inputMessages()) this.output.sendData(this.inner(message));
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/d2.js
var D2 = class {
	#operators = [];
	#nextOperatorId = 0;
	#finalized = false;
	constructor() {}
	#checkNotFinalized() {
		if (this.#finalized) throw new Error(`Graph already finalized`);
	}
	getNextOperatorId() {
		this.#checkNotFinalized();
		return this.#nextOperatorId++;
	}
	newInput() {
		this.#checkNotFinalized();
		const writer = new DifferenceStreamWriter();
		return new RootStreamBuilder(this, writer);
	}
	addOperator(operator) {
		this.#checkNotFinalized();
		this.#operators.push(operator);
	}
	finalize() {
		this.#checkNotFinalized();
		this.#finalized = true;
	}
	step() {
		if (!this.#finalized) throw new Error(`Graph not finalized`);
		for (const op of this.#operators) op.run();
	}
	pendingWork() {
		return this.#operators.some((op) => op.hasPendingWork());
	}
	run() {
		while (this.pendingWork()) this.step();
	}
};
var StreamBuilder = class {
	#graph;
	#writer;
	constructor(graph, writer) {
		this.#graph = graph;
		this.#writer = writer;
	}
	connectReader() {
		return this.#writer.newReader();
	}
	get writer() {
		return this.#writer;
	}
	get graph() {
		return this.#graph;
	}
	pipe(...operators) {
		return operators.reduce((stream, operator) => {
			return operator(stream);
		}, this);
	}
};
var RootStreamBuilder = class extends StreamBuilder {
	sendData(collection) {
		this.writer.sendData(collection);
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/concat.js
var ConcatOperator = class extends BinaryOperator {
	run() {
		for (const message of this.inputAMessages()) this.output.sendData(message);
		for (const message of this.inputBMessages()) this.output.sendData(message);
	}
};
function concat(other) {
	return (stream) => {
		if (stream.graph !== other.graph) throw new Error(`Cannot concat streams from different graphs`);
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new ConcatOperator(stream.graph.getNextOperatorId(), stream.connectReader(), other.connectReader(), output.writer);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/consolidate.js
var ConsolidateOperator = class extends UnaryOperator {
	run() {
		const messages = this.inputMessages();
		if (messages.length === 0) return;
		const combined = new MultiSet();
		for (const message of messages) combined.extend(message);
		const consolidated = combined.consolidate();
		if (consolidated.getInner().length > 0) this.output.sendData(consolidated);
	}
};
function consolidate() {
	return (stream) => {
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new ConsolidateOperator(stream.graph.getNextOperatorId(), stream.connectReader(), output.writer);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/indexes.js
var NO_PREFIX = /* @__PURE__ */ Symbol(`NO_PREFIX`);
var PrefixMap = class extends Map {
	/**
	* Add a value to the PrefixMap. Returns true if the map becomes empty after the operation.
	*/
	addValue(value, multiplicity) {
		if (multiplicity === 0) return this.size === 0;
		const prefix = getPrefix(value);
		const valueMapOrSingleValue = this.get(prefix);
		if (isSingleValue(valueMapOrSingleValue)) {
			const [currentValue, currentMultiplicity] = valueMapOrSingleValue;
			if (getPrefix(currentValue) !== prefix) throw new Error(`Mismatching prefixes, this should never happen`);
			if (currentValue === value || hash(currentValue) === hash(value)) {
				const newMultiplicity = currentMultiplicity + multiplicity;
				if (newMultiplicity === 0) this.delete(prefix);
				else this.set(prefix, [value, newMultiplicity]);
			} else {
				const valueMap = new ValueMap();
				valueMap.set(hash(currentValue), valueMapOrSingleValue);
				valueMap.set(hash(value), [value, multiplicity]);
				this.set(prefix, valueMap);
			}
		} else if (valueMapOrSingleValue === void 0) this.set(prefix, [value, multiplicity]);
		else if (valueMapOrSingleValue.addValue(value, multiplicity)) this.delete(prefix);
		return this.size === 0;
	}
};
var ValueMap = class extends Map {
	/**
	* Add a value to the ValueMap. Returns true if the map becomes empty after the operation.
	* @param value - The full value to store
	* @param multiplicity - The multiplicity to add
	* @param hashKey - Optional hash key to use instead of hashing the full value (used when in PrefixMap context)
	*/
	addValue(value, multiplicity) {
		if (multiplicity === 0) return this.size === 0;
		const key = hash(value);
		const currentValue = this.get(key);
		if (currentValue) {
			const [, currentMultiplicity] = currentValue;
			const newMultiplicity = currentMultiplicity + multiplicity;
			if (newMultiplicity === 0) this.delete(key);
			else this.set(key, [value, newMultiplicity]);
		} else this.set(key, [value, multiplicity]);
		return this.size === 0;
	}
};
var Index = class Index {
	#inner;
	#consolidatedMultiplicity = /* @__PURE__ */ new Map();
	constructor() {
		this.#inner = /* @__PURE__ */ new Map();
	}
	/**
	* Create an Index from multiple MultiSet messages.
	* @param messages - Array of MultiSet messages to build the index from.
	* @returns A new Index containing all the data from the messages.
	*/
	static fromMultiSets(messages) {
		const index = new Index();
		for (const message of messages) for (const [item, multiplicity] of message.getInner()) {
			const [key, value] = item;
			index.addValue(key, [value, multiplicity]);
		}
		return index;
	}
	/**
	* This method returns a string representation of the index.
	* @param indent - Whether to indent the string representation.
	* @returns A string representation of the index.
	*/
	toString(indent = false) {
		return `Index(${JSON.stringify([...this.entries()], void 0, indent ? 2 : void 0)})`;
	}
	/**
	* The size of the index.
	*/
	get size() {
		return this.#inner.size;
	}
	/**
	* This method checks if the index has a given key.
	* @param key - The key to check.
	* @returns True if the index has the key, false otherwise.
	*/
	has(key) {
		return this.#inner.has(key);
	}
	/**
	* Check if a key has presence (non-zero consolidated multiplicity).
	* @param key - The key to check.
	* @returns True if the key has non-zero consolidated multiplicity, false otherwise.
	*/
	hasPresence(key) {
		return (this.#consolidatedMultiplicity.get(key) || 0) !== 0;
	}
	/**
	* Get the consolidated multiplicity (sum of multiplicities) for a key.
	* @param key - The key to get the consolidated multiplicity for.
	* @returns The consolidated multiplicity for the key.
	*/
	getConsolidatedMultiplicity(key) {
		return this.#consolidatedMultiplicity.get(key) || 0;
	}
	/**
	* Get all keys that have presence (non-zero consolidated multiplicity).
	* @returns An iterator of keys with non-zero consolidated multiplicity.
	*/
	getPresenceKeys() {
		return this.#consolidatedMultiplicity.keys();
	}
	/**
	* This method returns all values for a given key.
	* @param key - The key to get the values for.
	* @returns An array of value tuples [value, multiplicity].
	*/
	get(key) {
		return [...this.getIterator(key)];
	}
	/**
	* This method returns an iterator over all values for a given key.
	* @param key - The key to get the values for.
	* @returns An iterator of value tuples [value, multiplicity].
	*/
	*getIterator(key) {
		const mapOrSingleValue = this.#inner.get(key);
		if (isSingleValue(mapOrSingleValue)) yield mapOrSingleValue;
		else if (mapOrSingleValue === void 0) return;
		else if (mapOrSingleValue instanceof ValueMap) for (const valueTuple of mapOrSingleValue.values()) yield valueTuple;
		else for (const singleValueOrValueMap of mapOrSingleValue.values()) if (isSingleValue(singleValueOrValueMap)) yield singleValueOrValueMap;
		else for (const valueTuple of singleValueOrValueMap.values()) yield valueTuple;
	}
	/**
	* This returns an iterator that iterates over all key-value pairs.
	* @returns An iterable of all key-value pairs (and their multiplicities) in the index.
	*/
	*entries() {
		for (const key of this.#inner.keys()) for (const valueTuple of this.getIterator(key)) yield [key, valueTuple];
	}
	/**
	* This method only iterates over the keys and not over the values.
	* Hence, it is more efficient than the `#entries` method.
	* It returns an iterator that you can use if you need to iterate over the values for a given key.
	* @returns An iterator of all *keys* in the index and their corresponding value iterator.
	*/
	*entriesIterators() {
		for (const key of this.#inner.keys()) yield [key, this.getIterator(key)];
	}
	/**
	* This method adds a value to the index.
	* @param key - The key to add the value to.
	* @param valueTuple - The value tuple [value, multiplicity] to add to the index.
	*/
	addValue(key, valueTuple) {
		const [value, multiplicity] = valueTuple;
		if (multiplicity === 0) return;
		const newConsolidatedMultiplicity = (this.#consolidatedMultiplicity.get(key) || 0) + multiplicity;
		if (newConsolidatedMultiplicity === 0) this.#consolidatedMultiplicity.delete(key);
		else this.#consolidatedMultiplicity.set(key, newConsolidatedMultiplicity);
		const mapOrSingleValue = this.#inner.get(key);
		if (mapOrSingleValue === void 0) {
			this.#inner.set(key, valueTuple);
			return;
		}
		if (isSingleValue(mapOrSingleValue)) {
			this.#handleSingleValueTransition(key, mapOrSingleValue, value, multiplicity);
			return;
		}
		if (mapOrSingleValue instanceof ValueMap) {
			const prefix = getPrefix(value);
			if (prefix !== NO_PREFIX) {
				const prefixMap = new PrefixMap();
				prefixMap.set(NO_PREFIX, mapOrSingleValue);
				prefixMap.set(prefix, valueTuple);
				this.#inner.set(key, prefixMap);
			} else if (mapOrSingleValue.addValue(value, multiplicity)) this.#inner.delete(key);
		} else if (mapOrSingleValue.addValue(value, multiplicity)) this.#inner.delete(key);
	}
	/**
	* Handle the transition from a single value to either a ValueMap or PrefixMap
	*/
	#handleSingleValueTransition(key, currentSingleValue, newValue, multiplicity) {
		const [currentValue, currentMultiplicity] = currentSingleValue;
		if (currentValue === newValue) {
			const newMultiplicity = currentMultiplicity + multiplicity;
			if (newMultiplicity === 0) this.#inner.delete(key);
			else this.#inner.set(key, [newValue, newMultiplicity]);
			return;
		}
		const newPrefix = getPrefix(newValue);
		const currentPrefix = getPrefix(currentValue);
		if (currentPrefix === newPrefix && (currentValue === newValue || hash(currentValue) === hash(newValue))) {
			const newMultiplicity = currentMultiplicity + multiplicity;
			if (newMultiplicity === 0) this.#inner.delete(key);
			else this.#inner.set(key, [newValue, newMultiplicity]);
			return;
		}
		if (currentPrefix === NO_PREFIX && newPrefix === NO_PREFIX) {
			const valueMap = new ValueMap();
			valueMap.set(hash(currentValue), currentSingleValue);
			valueMap.set(hash(newValue), [newValue, multiplicity]);
			this.#inner.set(key, valueMap);
		} else {
			const prefixMap = new PrefixMap();
			if (currentPrefix === newPrefix) {
				const valueMap = new ValueMap();
				valueMap.set(hash(currentValue), currentSingleValue);
				valueMap.set(hash(newValue), [newValue, multiplicity]);
				prefixMap.set(currentPrefix, valueMap);
			} else {
				prefixMap.set(currentPrefix, currentSingleValue);
				prefixMap.set(newPrefix, [newValue, multiplicity]);
			}
			this.#inner.set(key, prefixMap);
		}
	}
	/**
	* This method appends another index to the current index.
	* @param other - The index to append to the current index.
	*/
	append(other) {
		for (const [key, value] of other.entries()) this.addValue(key, value);
	}
	/**
	* This method joins two indexes.
	* @param other - The index to join with the current index.
	* @returns A multiset of the joined values.
	*/
	join(other) {
		const result = [];
		if (this.size <= other.size) for (const [key, valueIt] of this.entriesIterators()) {
			if (!other.has(key)) continue;
			const otherValues = other.get(key);
			for (const [val1, mul1] of valueIt) for (const [val2, mul2] of otherValues) if (mul1 !== 0 && mul2 !== 0) result.push([[key, [val1, val2]], mul1 * mul2]);
		}
		else for (const [key, otherValueIt] of other.entriesIterators()) {
			if (!this.has(key)) continue;
			const values = this.get(key);
			for (const [val2, mul2] of otherValueIt) for (const [val1, mul1] of values) if (mul1 !== 0 && mul2 !== 0) result.push([[key, [val1, val2]], mul1 * mul2]);
		}
		return new MultiSet(result);
	}
};
function getPrefix(value) {
	if (Array.isArray(value) && (typeof value[0] === `string` || typeof value[0] === `number` || typeof value[0] === `bigint`)) return value[0];
	return NO_PREFIX;
}
function isSingleValue(value) {
	return Array.isArray(value);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/reduce.js
var ReduceOperator = class extends UnaryOperator {
	#index = new Index();
	#indexOut = new Index();
	#f;
	constructor(id, inputA, output, f) {
		super(id, inputA, output);
		this.#f = f;
	}
	run() {
		const keysTodo = /* @__PURE__ */ new Set();
		for (const message of this.inputMessages()) for (const [item, multiplicity] of message.getInner()) {
			const [key, value] = item;
			this.#index.addValue(key, [value, multiplicity]);
			keysTodo.add(key);
		}
		const result = [];
		for (const key of keysTodo) {
			const curr = this.#index.get(key);
			const currOut = this.#indexOut.get(key);
			const out = this.#f(curr);
			const newOutputMap = /* @__PURE__ */ new Map();
			const oldOutputMap = /* @__PURE__ */ new Map();
			for (const [value, multiplicity] of out) {
				const existing = newOutputMap.get(value) ?? 0;
				newOutputMap.set(value, existing + multiplicity);
			}
			for (const [value, multiplicity] of currOut) {
				const existing = oldOutputMap.get(value) ?? 0;
				oldOutputMap.set(value, existing + multiplicity);
			}
			for (const [value, multiplicity] of oldOutputMap) if (!newOutputMap.has(value)) {
				result.push([[key, value], -multiplicity]);
				this.#indexOut.addValue(key, [value, -multiplicity]);
			}
			for (const [value, multiplicity] of newOutputMap) if (!oldOutputMap.has(value)) {
				if (multiplicity !== 0) {
					result.push([[key, value], multiplicity]);
					this.#indexOut.addValue(key, [value, multiplicity]);
				}
			}
			for (const [value, newMultiplicity] of newOutputMap) {
				const oldMultiplicity = oldOutputMap.get(value);
				if (oldMultiplicity !== void 0) {
					const delta = newMultiplicity - oldMultiplicity;
					if (delta !== 0) {
						result.push([[key, value], delta]);
						this.#indexOut.addValue(key, [value, delta]);
					}
				}
			}
		}
		if (result.length > 0) this.output.sendData(new MultiSet(result));
	}
};
function reduce(f) {
	return (stream) => {
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new ReduceOperator(stream.graph.getNextOperatorId(), stream.connectReader(), output.writer, f);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/distinct.js
var DistinctOperator = class extends UnaryOperator {
	#by;
	#values;
	constructor(id, input, output, by = (value) => value) {
		super(id, input, output);
		this.#by = by;
		this.#values = /* @__PURE__ */ new Map();
	}
	run() {
		const updatedValues = /* @__PURE__ */ new Map();
		for (const message of this.inputMessages()) for (const [value, diff] of message.getInner()) {
			const hashedValue = hash(this.#by(value));
			const newMultiplicity = (updatedValues.get(hashedValue)?.[0] ?? this.#values.get(hashedValue) ?? 0) + diff;
			updatedValues.set(hashedValue, [newMultiplicity, value]);
		}
		const result = [];
		for (const [hashedValue, [newMultiplicity, value]] of updatedValues.entries()) {
			const oldMultiplicity = this.#values.get(hashedValue) ?? 0;
			if (newMultiplicity === 0) this.#values.delete(hashedValue);
			else this.#values.set(hashedValue, newMultiplicity);
			if (oldMultiplicity <= 0 && newMultiplicity > 0) result.push([[hash(this.#by(value)), value[1]], 1]);
			else if (oldMultiplicity > 0 && newMultiplicity <= 0) result.push([[hash(this.#by(value)), value[1]], -1]);
		}
		if (result.length > 0) this.output.sendData(new MultiSet(result));
	}
};
function distinct(by = (value) => value) {
	return (stream) => {
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new DistinctOperator(stream.graph.getNextOperatorId(), stream.connectReader(), output.writer, by);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/filter.js
var FilterOperator = class extends LinearUnaryOperator {
	#f;
	constructor(id, inputA, output, f) {
		super(id, inputA, output);
		this.#f = f;
	}
	inner(collection) {
		return collection.filter(this.#f);
	}
};
function filter(f) {
	return (stream) => {
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new FilterOperator(stream.graph.getNextOperatorId(), stream.connectReader(), output.writer, f);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/fractional-indexing@3.2.0/node_modules/fractional-indexing/src/index.js
var BASE_62_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
/**
* @param {string} a
* @param {string | null | undefined} b
* @param {string} digits
* @returns {string}
*/
function midpoint(a, b, digits) {
	const zero = digits[0];
	if (b != null && a >= b) throw new Error(a + " >= " + b);
	if (a.slice(-1) === zero || b && b.slice(-1) === zero) throw new Error("trailing zero");
	if (b) {
		let n = 0;
		while ((a[n] || zero) === b[n]) n++;
		if (n > 0) return b.slice(0, n) + midpoint(a.slice(n), b.slice(n), digits);
	}
	const digitA = a ? digits.indexOf(a[0]) : 0;
	const digitB = b != null ? digits.indexOf(b[0]) : digits.length;
	if (digitB - digitA > 1) return digits[Math.round(.5 * (digitA + digitB))];
	else if (b && b.length > 1) return b.slice(0, 1);
	else return digits[digitA] + midpoint(a.slice(1), null, digits);
}
/**
* @param {string} int
* @return {void}
*/
function validateInteger(int) {
	if (int.length !== getIntegerLength(int[0])) throw new Error("invalid integer part of order key: " + int);
}
/**
* @param {string} head
* @return {number}
*/
function getIntegerLength(head) {
	if (head >= "a" && head <= "z") return head.charCodeAt(0) - "a".charCodeAt(0) + 2;
	else if (head >= "A" && head <= "Z") return "Z".charCodeAt(0) - head.charCodeAt(0) + 2;
	else throw new Error("invalid order key head: " + head);
}
/**
* @param {string} key
* @return {string}
*/
function getIntegerPart(key) {
	const integerPartLength = getIntegerLength(key[0]);
	if (integerPartLength > key.length) throw new Error("invalid order key: " + key);
	return key.slice(0, integerPartLength);
}
/**
* @param {string} key
* @param {string} digits
* @return {void}
*/
function validateOrderKey(key, digits) {
	if (key === "A" + digits[0].repeat(26)) throw new Error("invalid order key: " + key);
	const i = getIntegerPart(key);
	if (key.slice(i.length).slice(-1) === digits[0]) throw new Error("invalid order key: " + key);
}
/**
* @param {string} x
* @param {string} digits
* @return {string | null}
*/
function incrementInteger(x, digits) {
	validateInteger(x);
	const [head, ...digs] = x.split("");
	let carry = true;
	for (let i = digs.length - 1; carry && i >= 0; i--) {
		const d = digits.indexOf(digs[i]) + 1;
		if (d === digits.length) digs[i] = digits[0];
		else {
			digs[i] = digits[d];
			carry = false;
		}
	}
	if (carry) {
		if (head === "Z") return "a" + digits[0];
		if (head === "z") return null;
		const h = String.fromCharCode(head.charCodeAt(0) + 1);
		if (h > "a") digs.push(digits[0]);
		else digs.pop();
		return h + digs.join("");
	} else return head + digs.join("");
}
/**
* @param {string} x
* @param {string} digits
* @return {string | null}
*/
function decrementInteger(x, digits) {
	validateInteger(x);
	const [head, ...digs] = x.split("");
	let borrow = true;
	for (let i = digs.length - 1; borrow && i >= 0; i--) {
		const d = digits.indexOf(digs[i]) - 1;
		if (d === -1) digs[i] = digits.slice(-1);
		else {
			digs[i] = digits[d];
			borrow = false;
		}
	}
	if (borrow) {
		if (head === "a") return "Z" + digits.slice(-1);
		if (head === "A") return null;
		const h = String.fromCharCode(head.charCodeAt(0) - 1);
		if (h < "Z") digs.push(digits.slice(-1));
		else digs.pop();
		return h + digs.join("");
	} else return head + digs.join("");
}
/**
* @param {string | null | undefined} a
* @param {string | null | undefined} b
* @param {string=} digits
* @return {string}
*/
function generateKeyBetween(a, b, digits = BASE_62_DIGITS) {
	if (a != null) validateOrderKey(a, digits);
	if (b != null) validateOrderKey(b, digits);
	if (a != null && b != null && a >= b) throw new Error(a + " >= " + b);
	if (a == null) {
		if (b == null) return "a" + digits[0];
		const ib = getIntegerPart(b);
		const fb = b.slice(ib.length);
		if (ib === "A" + digits[0].repeat(26)) return ib + midpoint("", fb, digits);
		if (ib < b) return ib;
		const res = decrementInteger(ib, digits);
		if (res == null) throw new Error("cannot decrement any more");
		return res;
	}
	if (b == null) {
		const ia = getIntegerPart(a);
		const fa = a.slice(ia.length);
		const i = incrementInteger(ia, digits);
		return i == null ? ia + midpoint(fa, null, digits) : i;
	}
	const ia = getIntegerPart(a);
	const fa = a.slice(ia.length);
	const ib = getIntegerPart(b);
	const fb = b.slice(ib.length);
	if (ia === ib) return ia + midpoint(fa, fb, digits);
	const i = incrementInteger(ia, digits);
	if (i == null) throw new Error("cannot increment any more");
	if (i < b) return i;
	return ia + midpoint(fa, null, digits);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/topKArray.js
function indexedValue(value, index) {
	return [value, index];
}
function getValue(indexedVal) {
	return indexedVal[0];
}
function getIndex(indexedVal) {
	return indexedVal[1];
}
function createKeyedComparator(comparator) {
	return ([aKey, aVal], [bKey, bVal]) => {
		const valueComparison = comparator(aVal, bVal);
		if (valueComparison !== 0) return valueComparison;
		return compareKeys(aKey, bKey);
	};
}
var TopKArray = class {
	#sortedValues = [];
	#comparator;
	#topKStart;
	#topKEnd;
	constructor(offset, limit, comparator) {
		this.#topKStart = offset;
		this.#topKEnd = offset + limit;
		this.#comparator = comparator;
	}
	get size() {
		const offset = this.#topKStart;
		const limit = this.#topKEnd - this.#topKStart;
		const available = this.#sortedValues.length - offset;
		return Math.max(0, Math.min(limit, available));
	}
	/**
	* Moves the topK window
	*/
	move({ offset, limit }) {
		const oldOffset = this.#topKStart;
		const oldLimit = this.#topKEnd - this.#topKStart;
		const oldRange = [this.#topKStart, this.#topKEnd === Infinity ? this.#topKStart + this.size : this.#topKEnd];
		this.#topKStart = offset ?? oldOffset;
		this.#topKEnd = this.#topKStart + (limit ?? oldLimit);
		const { onlyInA, onlyInB } = diffHalfOpen(oldRange, [this.#topKStart, this.#topKEnd === Infinity ? Math.max(this.#topKStart + this.size, oldRange[1]) : this.#topKEnd]);
		const moveIns = [];
		onlyInB.forEach((index) => {
			const value = this.#sortedValues[index];
			if (value) moveIns.push(value);
		});
		const moveOuts = [];
		onlyInA.forEach((index) => {
			const value = this.#sortedValues[index];
			if (value) moveOuts.push(value);
		});
		return {
			moveIns,
			moveOuts,
			changes: onlyInA.length + onlyInB.length > 0
		};
	}
	insert(value) {
		const result = {
			moveIn: null,
			moveOut: null
		};
		const index = this.#findIndex(value);
		const val = indexedValue(value, generateKeyBetween(index === 0 ? null : getIndex(this.#sortedValues[index - 1]), index === this.#sortedValues.length ? null : getIndex(this.#sortedValues[index])));
		this.#sortedValues.splice(index, 0, val);
		if (index < this.#topKEnd) {
			const moveInIndex = Math.max(index, this.#topKStart);
			if (moveInIndex < this.#sortedValues.length) {
				result.moveIn = this.#sortedValues[moveInIndex];
				if (this.#topKEnd < this.#sortedValues.length) result.moveOut = this.#sortedValues[this.#topKEnd];
			}
		}
		return result;
	}
	/**
	* Deletes a value that may or may not be in the topK.
	* IMPORTANT: this assumes that the value is present in the collection
	*            if it's not the case it will remove the element
	*            that is on the position where the provided `value` would be.
	*/
	delete(value) {
		const result = {
			moveIn: null,
			moveOut: null
		};
		const index = this.#findIndex(value);
		const [removedElem] = this.#sortedValues.splice(index, 1);
		if (index < this.#topKEnd) {
			result.moveOut = removedElem;
			if (index < this.#topKStart) {
				const moveOutIndex = this.#topKStart - 1;
				if (moveOutIndex < this.#sortedValues.length) result.moveOut = this.#sortedValues[moveOutIndex];
				else result.moveOut = null;
			}
			const moveInIndex = this.#topKEnd - 1;
			if (moveInIndex < this.#sortedValues.length) result.moveIn = this.#sortedValues[moveInIndex];
		}
		return result;
	}
	#findIndex(value) {
		return binarySearch(this.#sortedValues, indexedValue(value, ``), (a, b) => this.#comparator(getValue(a), getValue(b)));
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/topKState.js
var TopKState = class {
	#multiplicities = /* @__PURE__ */ new Map();
	#topK;
	constructor(topK) {
		this.#topK = topK;
	}
	get size() {
		return this.#topK.size;
	}
	get isEmpty() {
		return this.#multiplicities.size === 0 && this.#topK.size === 0;
	}
	/**
	* Process an element update (insert or delete based on multiplicity change).
	* Returns the changes to the topK window.
	*/
	processElement(key, value, multiplicity) {
		const { oldMultiplicity, newMultiplicity } = this.#updateMultiplicity(key, multiplicity);
		if (oldMultiplicity <= 0 && newMultiplicity > 0) return this.#topK.insert([key, value]);
		else if (oldMultiplicity > 0 && newMultiplicity <= 0) return this.#topK.delete([key, value]);
		return {
			moveIn: null,
			moveOut: null
		};
	}
	/**
	* Move the topK window. Only works with TopKArray implementation.
	*/
	move(options) {
		if (!(this.#topK instanceof TopKArray)) throw new Error(`Cannot move B+-tree implementation of TopK with fractional index`);
		return this.#topK.move(options);
	}
	#updateMultiplicity(key, multiplicity) {
		if (multiplicity === 0) {
			const current = this.#multiplicities.get(key) ?? 0;
			return {
				oldMultiplicity: current,
				newMultiplicity: current
			};
		}
		const oldMultiplicity = this.#multiplicities.get(key) ?? 0;
		const newMultiplicity = oldMultiplicity + multiplicity;
		if (newMultiplicity === 0) this.#multiplicities.delete(key);
		else this.#multiplicities.set(key, newMultiplicity);
		return {
			oldMultiplicity,
			newMultiplicity
		};
	}
};
function handleMoveIn(moveIn, result) {
	if (moveIn) {
		const [[key, value], index] = moveIn;
		result.push([[key, [value, index]], 1]);
	}
}
function handleMoveOut(moveOut, result) {
	if (moveOut) {
		const [[key, value], index] = moveOut;
		result.push([[key, [value, index]], -1]);
	}
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/groupedTopKWithFractionalIndex.js
var GroupedTopKWithFractionalIndexOperator = class extends UnaryOperator {
	#groupStates = /* @__PURE__ */ new Map();
	#groupKeyFn;
	#comparator;
	#offset;
	#limit;
	constructor(id, inputA, output, comparator, options) {
		super(id, inputA, output);
		this.#groupKeyFn = options.groupKeyFn;
		this.#limit = options.limit ?? Infinity;
		this.#offset = options.offset ?? 0;
		this.#comparator = createKeyedComparator(comparator);
		options.setSizeCallback?.(() => this.#getTotalSize());
		options.setWindowFn?.(this.#moveTopK.bind(this));
	}
	/**
	* Creates a new TopK data structure for a group.
	* Can be overridden in subclasses to use different implementations (e.g., B+ tree).
	*/
	createTopK(offset, limit, comparator) {
		return new TopKArray(offset, limit, comparator);
	}
	#getTotalSize() {
		let size = 0;
		for (const state of this.#groupStates.values()) size += state.size;
		return size;
	}
	#getOrCreateGroupState(groupKey) {
		let state = this.#groupStates.get(groupKey);
		if (!state) {
			state = new TopKState(this.createTopK(this.#offset, this.#limit, this.#comparator));
			this.#groupStates.set(groupKey, state);
		}
		return state;
	}
	#cleanupGroupIfEmpty(groupKey, state) {
		if (state.isEmpty) this.#groupStates.delete(groupKey);
	}
	/**
	* Moves the topK window for all groups based on the provided offset and limit.
	* Any changes to the topK are sent to the output.
	*/
	#moveTopK({ offset, limit }) {
		if (offset !== void 0) this.#offset = offset;
		if (limit !== void 0) this.#limit = limit;
		const result = [];
		let hasChanges = false;
		for (const state of this.#groupStates.values()) {
			const diff = state.move({
				offset: this.#offset,
				limit: this.#limit
			});
			diff.moveIns.forEach((moveIn) => handleMoveIn(moveIn, result));
			diff.moveOuts.forEach((moveOut) => handleMoveOut(moveOut, result));
			if (diff.changes) hasChanges = true;
		}
		if (hasChanges) this.output.sendData(new MultiSet(result));
	}
	run() {
		const result = [];
		for (const message of this.inputMessages()) for (const [item, multiplicity] of message.getInner()) {
			const [key, value] = item;
			this.#processElement(key, value, multiplicity, result);
		}
		if (result.length > 0) this.output.sendData(new MultiSet(result));
	}
	#processElement(key, value, multiplicity, result) {
		const groupKey = this.#groupKeyFn(key, value);
		const state = this.#getOrCreateGroupState(groupKey);
		const changes = state.processElement(key, value, multiplicity);
		handleMoveIn(changes.moveIn, result);
		handleMoveOut(changes.moveOut, result);
		this.#cleanupGroupIfEmpty(groupKey, state);
	}
};
function groupedTopKWithFractionalIndex(comparator, options) {
	return (stream) => {
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new GroupedTopKWithFractionalIndexOperator(stream.graph.getNextOperatorId(), stream.connectReader(), output.writer, comparator, options);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/join.js
var JoinOperator = class extends BinaryOperator {
	#indexA = new Index();
	#indexB = new Index();
	#mode;
	constructor(id, inputA, inputB, output, mode = `inner`) {
		super(id, inputA, inputB, output);
		this.#mode = mode;
	}
	run() {
		const deltaA = Index.fromMultiSets(this.inputAMessages());
		const deltaB = Index.fromMultiSets(this.inputBMessages());
		if (deltaA.size === 0 && deltaB.size === 0) return;
		const results = new MultiSet();
		if (this.#mode !== `anti`) this.emitInnerResults(deltaA, deltaB, results);
		if (this.#mode === `left` || this.#mode === `full` || this.#mode === `anti`) this.emitLeftOuterResults(deltaA, deltaB, results);
		if (this.#mode === `right` || this.#mode === `full`) this.emitRightOuterResults(deltaA, deltaB, results);
		this.#indexA.append(deltaA);
		this.#indexB.append(deltaB);
		if (results.getInner().length > 0) this.output.sendData(results);
	}
	emitInnerResults(deltaA, deltaB, results) {
		if (deltaA.size > 0) results.extend(deltaA.join(this.#indexB));
		if (deltaB.size > 0) results.extend(this.#indexA.join(deltaB));
		if (deltaA.size > 0 && deltaB.size > 0) results.extend(deltaA.join(deltaB));
	}
	emitLeftOuterResults(deltaA, deltaB, results) {
		if (deltaA.size > 0) {
			for (const [key, valueIterator] of deltaA.entriesIterators()) if (this.#indexB.getConsolidatedMultiplicity(key) + deltaB.getConsolidatedMultiplicity(key) === 0) {
				for (const [value, multiplicity] of valueIterator) if (multiplicity !== 0) results.add([key, [value, null]], multiplicity);
			}
		}
		if (deltaB.size > 0) for (const key of deltaB.getPresenceKeys()) {
			const before = this.#indexB.getConsolidatedMultiplicity(key);
			const deltaMult = deltaB.getConsolidatedMultiplicity(key);
			if (deltaMult === 0) continue;
			const after = before + deltaMult;
			if (before === 0 === (after === 0)) continue;
			const transitioningToMatched = before === 0;
			for (const [value, multiplicity] of this.#indexA.getIterator(key)) if (multiplicity !== 0) results.add([key, [value, null]], transitioningToMatched ? -multiplicity : +multiplicity);
		}
	}
	emitRightOuterResults(deltaA, deltaB, results) {
		if (deltaB.size > 0) {
			for (const [key, valueIterator] of deltaB.entriesIterators()) if (this.#indexA.getConsolidatedMultiplicity(key) + deltaA.getConsolidatedMultiplicity(key) === 0) {
				for (const [value, multiplicity] of valueIterator) if (multiplicity !== 0) results.add([key, [null, value]], multiplicity);
			}
		}
		if (deltaA.size > 0) for (const key of deltaA.getPresenceKeys()) {
			const before = this.#indexA.getConsolidatedMultiplicity(key);
			const deltaMult = deltaA.getConsolidatedMultiplicity(key);
			if (deltaMult === 0) continue;
			const after = before + deltaMult;
			if (before === 0 === (after === 0)) continue;
			const transitioningToMatched = before === 0;
			for (const [value, multiplicity] of this.#indexB.getIterator(key)) if (multiplicity !== 0) results.add([key, [null, value]], transitioningToMatched ? -multiplicity : +multiplicity);
		}
	}
};
function join(other, type = `inner`) {
	return (stream) => {
		if (stream.graph !== other.graph) throw new Error(`Cannot join streams from different graphs`);
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new JoinOperator(stream.graph.getNextOperatorId(), stream.connectReader(), other.connectReader(), output.writer, type);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/map.js
var MapOperator = class extends LinearUnaryOperator {
	#f;
	constructor(id, inputA, output, f) {
		super(id, inputA, output);
		this.#f = f;
	}
	inner(collection) {
		return collection.map(this.#f);
	}
};
function map(f) {
	return (stream) => {
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new MapOperator(stream.graph.getNextOperatorId(), stream.connectReader(), output.writer, f);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/output.js
var OutputOperator = class extends UnaryOperator {
	#fn;
	constructor(id, inputA, outputWriter, fn) {
		super(id, inputA, outputWriter);
		this.#fn = fn;
	}
	run() {
		for (const message of this.inputMessages()) {
			this.#fn(message);
			this.output.sendData(message);
		}
	}
};
function output(fn) {
	return (stream) => {
		const outputStream = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new OutputOperator(stream.graph.getNextOperatorId(), stream.connectReader(), outputStream.writer, fn);
		stream.graph.addOperator(operator);
		return outputStream;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/tap.js
var TapOperator = class extends LinearUnaryOperator {
	#f;
	constructor(id, inputA, output, f) {
		super(id, inputA, output);
		this.#f = f;
	}
	inner(collection) {
		this.#f(collection);
		return collection;
	}
};
function tap(f) {
	return (stream) => {
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new TapOperator(stream.graph.getNextOperatorId(), stream.connectReader(), output.writer, f);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/topKWithFractionalIndex.js
var TopKWithFractionalIndexOperator = class extends UnaryOperator {
	#state;
	constructor(id, inputA, output, comparator, options) {
		super(id, inputA, output);
		const limit = options.limit ?? Infinity;
		const offset = options.offset ?? 0;
		const topK = this.createTopK(offset, limit, createKeyedComparator(comparator));
		this.#state = new TopKState(topK);
		options.setSizeCallback?.(() => this.#state.size);
		options.setWindowFn?.(this.moveTopK.bind(this));
	}
	createTopK(offset, limit, comparator) {
		return new TopKArray(offset, limit, comparator);
	}
	/**
	* Moves the topK window based on the provided offset and limit.
	* Any changes to the topK are sent to the output.
	*/
	moveTopK({ offset, limit }) {
		const result = [];
		const diff = this.#state.move({
			offset,
			limit
		});
		diff.moveIns.forEach((moveIn) => handleMoveIn(moveIn, result));
		diff.moveOuts.forEach((moveOut) => handleMoveOut(moveOut, result));
		if (diff.changes) this.output.sendData(new MultiSet(result));
	}
	run() {
		const result = [];
		for (const message of this.inputMessages()) for (const [item, multiplicity] of message.getInner()) {
			const [key, value] = item;
			this.processElement(key, value, multiplicity, result);
		}
		if (result.length > 0) this.output.sendData(new MultiSet(result));
	}
	processElement(key, value, multiplicity, result) {
		const changes = this.#state.processElement(key, value, multiplicity);
		handleMoveIn(changes.moveIn, result);
		handleMoveOut(changes.moveOut, result);
	}
};
function topKWithFractionalIndex(comparator, options) {
	const opts = options || {};
	return (stream) => {
		const output = new StreamBuilder(stream.graph, new DifferenceStreamWriter());
		const operator = new TopKWithFractionalIndexOperator(stream.graph.getNextOperatorId(), stream.connectReader(), output.writer, comparator, opts);
		stream.graph.addOperator(operator);
		return output;
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/groupBy.js
function isPipedAggregateFunction(aggregate) {
	return `pipe` in aggregate;
}
function groupBy(keyExtractor, aggregates = {}) {
	const basicAggregates = Object.fromEntries(Object.entries(aggregates).filter(([_, aggregate]) => !isPipedAggregateFunction(aggregate)));
	Object.fromEntries(Object.entries(aggregates).filter(([_, aggregate]) => isPipedAggregateFunction(aggregate)));
	return (stream) => {
		const KEY_SENTINEL = `__original_key__`;
		return stream.pipe(map((data) => {
			const key = keyExtractor(data);
			const keyString = serializeValue(key);
			const values = {};
			values[KEY_SENTINEL] = key;
			for (const [name, aggregate] of Object.entries(basicAggregates)) values[name] = aggregate.preMap(data);
			return [keyString, values];
		})).pipe(reduce((values) => {
			let totalMultiplicity = 0;
			for (const [_, multiplicity] of values) totalMultiplicity += multiplicity;
			if (totalMultiplicity <= 0) return [];
			const result = {};
			result[KEY_SENTINEL] = values[0]?.[0]?.[KEY_SENTINEL];
			for (const [name, aggregate] of Object.entries(basicAggregates)) {
				const preValues = values.map(([v, m]) => [v[name], m]);
				result[name] = aggregate.reduce(preValues);
			}
			return [[result, 1]];
		})).pipe(map(([keyString, values]) => {
			const key = values[KEY_SENTINEL];
			const result = {};
			Object.assign(result, key);
			for (const [name, aggregate] of Object.entries(basicAggregates)) if (aggregate.postMap) result[name] = aggregate.postMap(values[name]);
			else result[name] = values[name];
			return [keyString, result];
		}));
	};
}
function sum$1(valueExtractor = (v) => v) {
	return {
		preMap: (data) => valueExtractor(data),
		reduce: (values) => {
			let total = 0;
			for (const [value, multiplicity] of values) total += value * multiplicity;
			return total;
		}
	};
}
function count$2(valueExtractor = (v) => v) {
	return {
		preMap: (data) => valueExtractor(data) == null ? 0 : 1,
		reduce: (values) => {
			let totalCount = 0;
			for (const [nullMultiplier, multiplicity] of values) totalCount += nullMultiplier * multiplicity;
			return totalCount;
		}
	};
}
function avg$1(valueExtractor = (v) => v) {
	return {
		preMap: (data) => ({
			sum: valueExtractor(data),
			count: 0
		}),
		reduce: (values) => {
			let totalSum = 0;
			let totalCount = 0;
			for (const [value, multiplicity] of values) {
				totalSum += value.sum * multiplicity;
				totalCount += multiplicity;
			}
			return {
				sum: totalSum,
				count: totalCount
			};
		},
		postMap: (result) => {
			return result.sum / result.count;
		}
	};
}
function min$1(valueExtractor) {
	const extractor = valueExtractor ?? ((v) => v);
	return {
		preMap: (data) => extractor(data),
		reduce: (values) => {
			let minValue;
			for (const [value, _multiplicity] of values) if (!minValue || value && value < minValue) minValue = value;
			return minValue;
		}
	};
}
function max$1(valueExtractor) {
	const extractor = valueExtractor ?? ((v) => v);
	return {
		preMap: (data) => extractor(data),
		reduce: (values) => {
			let maxValue;
			for (const [value, _multiplicity] of values) if (!maxValue || value && value > maxValue) maxValue = value;
			return maxValue;
		}
	};
}
function median(valueExtractor = (v) => v) {
	return {
		preMap: (data) => [valueExtractor(data)],
		reduce: (values) => {
			const allValues = [];
			for (const [valueArray, multiplicity] of values) for (const value of valueArray) for (let i = 0; i < multiplicity; i++) allValues.push(value);
			if (allValues.length === 0) return [];
			allValues.sort((a, b) => a - b);
			return allValues;
		},
		postMap: (result) => {
			if (result.length === 0) return 0;
			const mid = Math.floor(result.length / 2);
			if (result.length % 2 === 0) return (result[mid - 1] + result[mid]) / 2;
			return result[mid];
		}
	};
}
function mode(valueExtractor = (v) => v) {
	return {
		preMap: (data) => {
			const value = valueExtractor(data);
			const frequencyMap = /* @__PURE__ */ new Map();
			frequencyMap.set(value, 1);
			return frequencyMap;
		},
		reduce: (values) => {
			const combinedMap = /* @__PURE__ */ new Map();
			for (const [frequencyMap, multiplicity] of values) for (const [value, frequencyCount] of frequencyMap.entries()) {
				const currentCount = combinedMap.get(value) || 0;
				combinedMap.set(value, currentCount + frequencyCount * multiplicity);
			}
			return combinedMap;
		},
		postMap: (result) => {
			if (result.size === 0) return 0;
			let modeValue = 0;
			let maxFrequency = 0;
			for (const [value, frequency] of result.entries()) if (frequency > maxFrequency) {
				maxFrequency = frequency;
				modeValue = value;
			}
			return modeValue;
		}
	};
}
var groupByOperators = {
	sum: sum$1,
	count: count$2,
	avg: avg$1,
	min: min$1,
	max: max$1,
	median,
	mode
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/groupedOrderBy.js
function groupedOrderByWithFractionalIndex(valueExtractor, options) {
	const limit = options.limit ?? Infinity;
	const offset = options.offset ?? 0;
	const setSizeCallback = options.setSizeCallback;
	const setWindowFn = options.setWindowFn;
	const groupKeyFn = options.groupKeyFn;
	const comparator = options.comparator ?? ((a, b) => {
		if (a === b) return 0;
		if (a < b) return -1;
		return 1;
	});
	return (stream) => {
		return stream.pipe(groupedTopKWithFractionalIndex((a, b) => comparator(valueExtractor(a), valueExtractor(b)), {
			limit,
			offset,
			setSizeCallback,
			setWindowFn,
			groupKeyFn
		}), consolidate());
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db-ivm@0.1.18_typescript@6.0.3/node_modules/@tanstack/db-ivm/dist/esm/operators/orderBy.js
function orderByWithFractionalIndexBase(topKFunction, valueExtractor, options) {
	const limit = options?.limit ?? Infinity;
	const offset = options?.offset ?? 0;
	const setSizeCallback = options?.setSizeCallback;
	const setWindowFn = options?.setWindowFn;
	const comparator = options?.comparator ?? ((a, b) => {
		if (a === b) return 0;
		if (a < b) return -1;
		return 1;
	});
	return (stream) => {
		return stream.pipe(topKFunction((a, b) => comparator(valueExtractor(a), valueExtractor(b)), {
			limit,
			offset,
			setSizeCallback,
			setWindowFn
		}), consolidate());
	};
}
function orderByWithFractionalIndex(valueExtractor, options) {
	return orderByWithFractionalIndexBase(topKWithFractionalIndex, valueExtractor, options);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/compiler/group-by.js
var VIRTUAL_SYNCED_KEY = `__virtual_synced__`;
var VIRTUAL_HAS_LOCAL_KEY = `__virtual_has_local__`;
var GROUP_KEY_REF_PREFIX = `__group_key_`;
function getRowVirtualMetadata(row) {
	let found = false;
	let allSynced = true;
	let hasLocal = false;
	for (const [alias, value] of Object.entries(row)) {
		if (alias === `$selected`) continue;
		if (value === null || typeof value !== `object`) continue;
		const asRecord = value;
		const hasSyncedProp = `$synced` in asRecord;
		const hasOriginProp = `$origin` in asRecord;
		if (!hasSyncedProp && !hasOriginProp) continue;
		found = true;
		if (asRecord.$synced === false) allSynced = false;
		if (asRecord.$origin === `local`) hasLocal = true;
	}
	return {
		synced: found ? allSynced : true,
		hasLocal
	};
}
var { sum, count: count$1, avg, min, max } = groupByOperators;
function validateAndCreateMapping(groupByClause, selectClause) {
	const selectToGroupByIndex = /* @__PURE__ */ new Map();
	const groupByExpressions = [...groupByClause];
	if (!selectClause) return {
		selectToGroupByIndex,
		groupByExpressions
	};
	for (const [alias, expr] of Object.entries(selectClause)) {
		if (expr.type === `agg` || containsAggregate(expr)) continue;
		const groupIndex = groupByExpressions.findIndex((groupExpr) => expressionsEqual(expr, groupExpr));
		if (groupIndex === -1) throw new NonAggregateExpressionNotInGroupByError(alias);
		selectToGroupByIndex.set(alias, groupIndex);
	}
	return {
		selectToGroupByIndex,
		groupByExpressions
	};
}
function processGroupBy(pipeline, groupByClause, havingClauses, selectClause, fnHavingClauses, aggregateCollectionId, mainSource) {
	const virtualAggregates = {
		[VIRTUAL_SYNCED_KEY]: {
			preMap: ([, row]) => getRowVirtualMetadata(row).synced,
			reduce: (values) => {
				for (const [isSynced, multiplicity] of values) if (!isSynced && multiplicity > 0) return false;
				return true;
			}
		},
		[VIRTUAL_HAS_LOCAL_KEY]: {
			preMap: ([, row]) => getRowVirtualMetadata(row).hasLocal,
			reduce: (values) => {
				for (const [isLocal, multiplicity] of values) if (isLocal && multiplicity > 0) return true;
				return false;
			}
		}
	};
	if (groupByClause.length === 0) {
		const aggregates2 = virtualAggregates;
		const wrappedAggExprs2 = {};
		const aggCounter2 = { value: 0 };
		if (selectClause) {
			for (const [alias, expr] of Object.entries(selectClause)) if (expr.type === `agg`) aggregates2[alias] = getAggregateFunction(expr);
			else if (containsAggregate(expr)) {
				const { transformed, extracted } = extractAndReplaceAggregates(expr, aggCounter2);
				for (const [syntheticAlias, aggExpr] of Object.entries(extracted)) aggregates2[syntheticAlias] = getAggregateFunction(aggExpr);
				wrappedAggExprs2[alias] = compileGroupedSelectValue(transformed);
			}
		}
		const keyExtractor2 = mainSource ? ([, row]) => ({
			__singleGroup: true,
			__correlationKey: row?.[mainSource]?.__correlationKey
		}) : () => ({ __singleGroup: true });
		pipeline = pipeline.pipe(groupBy(keyExtractor2, aggregates2));
		pipeline = pipeline.pipe(map(([, aggregatedRow]) => {
			const finalResults = { ...aggregatedRow.$selected || {} };
			if (selectClause) {
				for (const [alias, expr] of Object.entries(selectClause)) if (expr.type === `agg`) finalResults[alias] = aggregatedRow[alias];
				evaluateWrappedAggregates(finalResults, aggregatedRow, wrappedAggExprs2);
			}
			const correlationKey = mainSource ? aggregatedRow.__correlationKey : void 0;
			const resultKey = correlationKey !== void 0 ? `single_group_${serializeValue(correlationKey)}` : `single_group`;
			const resultRow = {
				...aggregatedRow,
				$selected: finalResults
			};
			const groupSynced = aggregatedRow[VIRTUAL_SYNCED_KEY];
			const groupHasLocal = aggregatedRow[VIRTUAL_HAS_LOCAL_KEY];
			resultRow.$synced = groupSynced ?? true;
			resultRow.$origin = groupHasLocal ? `local` : `remote`;
			resultRow.$key = resultKey;
			resultRow.$collectionId = aggregateCollectionId ?? resultRow.$collectionId;
			if (mainSource && correlationKey !== void 0) resultRow[mainSource] = { __correlationKey: correlationKey };
			return [resultKey, resultRow];
		}));
		if (havingClauses && havingClauses.length > 0) for (const havingClause of havingClauses) {
			const compiledHaving = compileExpression(replaceAggregatesByRefs(getHavingExpression(havingClause), selectClause || {}, `$selected`));
			pipeline = pipeline.pipe(filter(([, row]) => {
				return toBooleanPredicate(compiledHaving({ $selected: row.$selected }));
			}));
		}
		if (fnHavingClauses && fnHavingClauses.length > 0) for (const fnHaving of fnHavingClauses) pipeline = pipeline.pipe(filter(([, row]) => {
			return toBooleanPredicate(fnHaving({ $selected: row.$selected }));
		}));
		return pipeline;
	}
	const mapping = validateAndCreateMapping(groupByClause, selectClause);
	const compiledGroupByExpressions = groupByClause.map((e) => compileExpression(e));
	const keyExtractor = ([, row]) => {
		const namespacedRow = { ...row };
		delete namespacedRow.$selected;
		const key = {};
		for (let i = 0; i < groupByClause.length; i++) {
			const compiledExpr = compiledGroupByExpressions[i];
			const value = compiledExpr(namespacedRow);
			key[`__key_${i}`] = value;
		}
		if (mainSource) key.__correlationKey = row?.[mainSource]?.__correlationKey;
		return key;
	};
	const aggregates = virtualAggregates;
	const wrappedAggExprs = {};
	const aggCounter = { value: 0 };
	if (selectClause) {
		for (const [alias, expr] of Object.entries(selectClause)) if (expr.type === `agg`) aggregates[alias] = getAggregateFunction(expr);
		else if (containsAggregate(expr)) {
			const { transformed, extracted } = extractAndReplaceAggregates(expr, aggCounter);
			for (const [syntheticAlias, aggExpr] of Object.entries(extracted)) aggregates[syntheticAlias] = getAggregateFunction(aggExpr);
			wrappedAggExprs[alias] = compileGroupedSelectValue(replaceGroupByRefsInSelectValue(transformed, groupByClause));
		}
	}
	pipeline = pipeline.pipe(groupBy(keyExtractor, aggregates));
	pipeline = pipeline.pipe(map(([, aggregatedRow]) => {
		const selectResults = aggregatedRow.$selected || {};
		const finalResults = {};
		if (selectClause) {
			for (const [alias, expr] of Object.entries(selectClause)) if (expr.type === `agg`) finalResults[alias] = aggregatedRow[alias];
			else if (!wrappedAggExprs[alias]) {
				const groupIndex = mapping.selectToGroupByIndex.get(alias);
				if (groupIndex !== void 0) finalResults[alias] = aggregatedRow[`__key_${groupIndex}`];
				else finalResults[alias] = selectResults[alias];
			}
			evaluateWrappedAggregates(finalResults, aggregatedRow, wrappedAggExprs, groupByClause.length);
		} else for (let i = 0; i < groupByClause.length; i++) finalResults[`__key_${i}`] = aggregatedRow[`__key_${i}`];
		const correlationKey = mainSource ? aggregatedRow.__correlationKey : void 0;
		const keyParts = [];
		for (let i = 0; i < groupByClause.length; i++) keyParts.push(aggregatedRow[`__key_${i}`]);
		if (correlationKey !== void 0) keyParts.push(correlationKey);
		const finalKey = keyParts.length === 1 ? keyParts[0] : serializeValue(keyParts);
		const resultRow = {
			...aggregatedRow,
			$selected: finalResults
		};
		const groupSynced = aggregatedRow[VIRTUAL_SYNCED_KEY];
		const groupHasLocal = aggregatedRow[VIRTUAL_HAS_LOCAL_KEY];
		resultRow.$synced = groupSynced ?? true;
		resultRow.$origin = groupHasLocal ? `local` : `remote`;
		resultRow.$key = finalKey;
		resultRow.$collectionId = aggregateCollectionId ?? resultRow.$collectionId;
		if (mainSource && correlationKey !== void 0) resultRow[mainSource] = { __correlationKey: correlationKey };
		return [finalKey, resultRow];
	}));
	if (havingClauses && havingClauses.length > 0) for (const havingClause of havingClauses) {
		const compiledHaving = compileExpression(replaceAggregatesByRefs(getHavingExpression(havingClause), selectClause || {}));
		pipeline = pipeline.pipe(filter(([, row]) => {
			return compiledHaving({ $selected: row.$selected });
		}));
	}
	if (fnHavingClauses && fnHavingClauses.length > 0) for (const fnHaving of fnHavingClauses) pipeline = pipeline.pipe(filter(([, row]) => {
		return toBooleanPredicate(fnHaving({ $selected: row.$selected }));
	}));
	return pipeline;
}
function expressionsEqual(expr1, expr2) {
	if (!expr1 || !expr2) return false;
	if (expr1.type !== expr2.type) return false;
	switch (expr1.type) {
		case `ref`:
			if (!expr1.path || !expr2.path) return false;
			if (expr1.path.length !== expr2.path.length) return false;
			return expr1.path.every((segment, i) => segment === expr2.path[i]);
		case `val`: return expr1.value === expr2.value;
		case `func`: return expr1.name === expr2.name && expr1.args?.length === expr2.args?.length && (expr1.args || []).every((arg, i) => expressionsEqual(arg, expr2.args[i]));
		case `agg`: return expr1.name === expr2.name && expr1.args?.length === expr2.args?.length && (expr1.args || []).every((arg, i) => expressionsEqual(arg, expr2.args[i]));
		default: return false;
	}
}
function getAggregateFunction(aggExpr) {
	const compiledExpr = compileExpression(aggExpr.args[0]);
	const valueExtractor = ([, namespacedRow]) => {
		const value = compiledExpr(namespacedRow);
		if (typeof value === `number`) return value;
		return value != null ? Number(value) : 0;
	};
	const valueExtractorForMinMax = ([, namespacedRow]) => {
		const value = compiledExpr(namespacedRow);
		if (typeof value === `number` || typeof value === `string` || typeof value === `bigint` || value instanceof Date) return value;
		return value != null ? Number(value) : 0;
	};
	const rawValueExtractor = ([, namespacedRow]) => {
		return compiledExpr(namespacedRow);
	};
	switch (aggExpr.name.toLowerCase()) {
		case `sum`: return sum(valueExtractor);
		case `count`: return count$1(rawValueExtractor);
		case `avg`: return avg(valueExtractor);
		case `min`: return min(valueExtractorForMinMax);
		case `max`: return max(valueExtractorForMinMax);
		default: throw new UnsupportedAggregateFunctionError(aggExpr.name);
	}
}
function replaceAggregatesByRefs(havingExpr, selectClause, resultAlias = `$selected`) {
	switch (havingExpr.type) {
		case `agg`: {
			const aggExpr = havingExpr;
			for (const [alias, selectExpr] of Object.entries(selectClause)) if (selectExpr.type === `agg` && aggregatesEqual(aggExpr, selectExpr)) return new PropRef([resultAlias, alias]);
			throw new AggregateFunctionNotInSelectError(aggExpr.name);
		}
		case `func`: {
			const funcExpr = havingExpr;
			const transformedArgs = funcExpr.args.map((arg) => replaceAggregatesByRefs(arg, selectClause));
			return new Func(funcExpr.name, transformedArgs);
		}
		case `ref`: return havingExpr;
		case `val`: return havingExpr;
		default: throw new UnknownHavingExpressionTypeError(havingExpr.type);
	}
}
function evaluateWrappedAggregates(finalResults, aggregatedRow, wrappedAggExprs, groupKeyCount = 0) {
	for (const key of Object.keys(aggregatedRow)) if (key.startsWith(`__agg_`)) finalResults[key] = aggregatedRow[key];
	for (let i = 0; i < groupKeyCount; i++) finalResults[`${GROUP_KEY_REF_PREFIX}${i}`] = aggregatedRow[`__key_${i}`];
	for (const [alias, evaluator] of Object.entries(wrappedAggExprs)) finalResults[alias] = evaluator({ $selected: finalResults });
	for (const key of Object.keys(finalResults)) if (key.startsWith(`__agg_`) || key.startsWith(GROUP_KEY_REF_PREFIX)) delete finalResults[key];
}
function containsAggregate(expr) {
	if (isConditionalSelect(expr)) return expr.branches.some((branch) => containsAggregate(branch.condition) || containsAggregate(branch.value)) || expr.defaultValue !== void 0 && containsAggregate(expr.defaultValue);
	if (isNestedSelectObject$3(expr)) return Object.values(expr).some((value) => containsAggregate(value));
	if (!isExpressionLike(expr)) return false;
	if (expr.type === `agg`) return true;
	if (expr.type === `func` && `args` in expr) return expr.args.some((arg) => containsAggregate(arg));
	return false;
}
function extractAndReplaceAggregates(expr, counter) {
	if (expr.type === `includesSubquery`) return {
		transformed: expr,
		extracted: {}
	};
	if (expr.type === `agg`) {
		const alias = `__agg_${counter.value++}`;
		return {
			transformed: new PropRef([`$selected`, alias]),
			extracted: { [alias]: expr }
		};
	}
	if (expr.type === `func`) {
		const allExtracted = {};
		const newArgs = expr.args.map((arg) => {
			const result = extractAndReplaceAggregates(arg, counter);
			Object.assign(allExtracted, result.extracted);
			return result.transformed;
		});
		return {
			transformed: new Func(expr.name, newArgs),
			extracted: allExtracted
		};
	}
	if (isConditionalSelect(expr)) {
		const allExtracted = {};
		const branches = expr.branches.map((branch) => {
			const condition = extractAndReplaceAggregates(branch.condition, counter);
			const value = extractAndReplaceAggregates(branch.value, counter);
			Object.assign(allExtracted, condition.extracted, value.extracted);
			return {
				condition: condition.transformed,
				value: value.transformed
			};
		});
		const defaultValue = expr.defaultValue === void 0 ? void 0 : extractAndReplaceAggregates(expr.defaultValue, counter);
		if (defaultValue) Object.assign(allExtracted, defaultValue.extracted);
		return {
			transformed: new ConditionalSelect(branches, defaultValue?.transformed),
			extracted: allExtracted
		};
	}
	if (isNestedSelectObject$3(expr)) {
		const allExtracted = {};
		const transformed = {};
		for (const [key, value] of Object.entries(expr)) {
			const result = extractAndReplaceAggregates(value, counter);
			Object.assign(allExtracted, result.extracted);
			transformed[key] = result.transformed;
		}
		return {
			transformed,
			extracted: allExtracted
		};
	}
	return {
		transformed: expr,
		extracted: {}
	};
}
function replaceGroupByRefsInSelectValue(value, groupByClause) {
	if (isConditionalSelect(value)) return new ConditionalSelect(value.branches.map((branch) => ({
		condition: replaceGroupByRefsInExpression(branch.condition, groupByClause),
		value: replaceGroupByRefsInSelectValue(branch.value, groupByClause)
	})), value.defaultValue === void 0 ? void 0 : replaceGroupByRefsInSelectValue(value.defaultValue, groupByClause));
	if (isNestedSelectObject$3(value)) {
		const transformed = {};
		for (const [key, entry] of Object.entries(value)) transformed[key] = replaceGroupByRefsInSelectValue(entry, groupByClause);
		return transformed;
	}
	if (!isExpressionLike(value)) return value;
	if (value.type === `includesSubquery` || value.type === `agg`) return value;
	return replaceGroupByRefsInExpression(value, groupByClause);
}
function replaceGroupByRefsInExpression(expr, groupByClause) {
	if (expr.type === `ref`) {
		const groupIndex = groupByClause.findIndex((groupExpr) => expressionsEqual(expr, groupExpr));
		return groupIndex === -1 ? expr : new PropRef([`$selected`, `${GROUP_KEY_REF_PREFIX}${groupIndex}`]);
	}
	if (expr.type === `func`) return new Func(expr.name, expr.args.map((arg) => replaceGroupByRefsInExpression(arg, groupByClause)));
	return expr;
}
function compileGroupedSelectValue(value) {
	if (isConditionalSelect(value)) return compileGroupedConditionalSelect(value);
	if (value.type === `includesSubquery`) return () => null;
	if (isNestedSelectObject$3(value)) return compileGroupedSelectObject(value);
	if (!isExpressionLike(value)) return () => value;
	return compileExpression(value);
}
function compileGroupedSelectObject(obj) {
	const entries = Object.entries(obj).map(([key, value]) => {
		if (key.startsWith(`__SPREAD_SENTINEL__`)) {
			const rest = key.slice(`__SPREAD_SENTINEL__`.length);
			const splitIndex = rest.lastIndexOf(`__`);
			const pathStr = splitIndex >= 0 ? rest.slice(0, splitIndex) : rest;
			return {
				key,
				spread: true,
				value: compileExpression(typeof value === `object` && `type` in value && value.type === `ref` ? value : new PropRef(pathStr.split(`.`)))
			};
		}
		return {
			key,
			spread: false,
			value: compileGroupedSelectValue(value)
		};
	});
	return (row) => {
		const result = {};
		for (const entry of entries) {
			const value = entry.value(row);
			if (entry.spread) {
				if (value && typeof value === `object`) Object.assign(result, value);
			} else result[entry.key] = value;
		}
		return result;
	};
}
function compileGroupedConditionalSelect(conditional) {
	const branches = conditional.branches.map((branch) => ({
		condition: compileExpression(branch.condition),
		value: compileGroupedSelectValue(branch.value)
	}));
	const defaultValue = conditional.defaultValue === void 0 ? void 0 : compileGroupedSelectValue(conditional.defaultValue);
	return (row) => {
		for (const branch of branches) if (isCaseWhenConditionTrue(branch.condition(row))) return branch.value(row);
		return defaultValue !== void 0 ? defaultValue(row) : null;
	};
}
function isNestedSelectObject$3(value) {
	return value != null && typeof value === `object` && !Array.isArray(value) && !value.__refProxy && !isExpressionLike(value);
}
function isConditionalSelect(value) {
	return value instanceof ConditionalSelect || value != null && typeof value === `object` && value.type === `conditionalSelect`;
}
function aggregatesEqual(agg1, agg2) {
	return agg1.name === agg2.name && agg1.args.length === agg2.args.length && agg1.args.every((arg, i) => expressionsEqual(arg, agg2.args[i]));
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/compiler/order-by.js
function processOrderBy(rawQuery, pipeline, orderByClause, selectClause, collection, optimizableOrderByCollections, setWindowFn, limit, offset, groupKeyFn) {
	const compiledOrderBy = orderByClause.map((clause) => {
		return {
			compiledExpression: compileExpression(replaceAggregatesByRefs(clause.expression, selectClause, `$selected`)),
			compareOptions: buildCompareOptions(clause, collection)
		};
	});
	const valueExtractor = (row) => {
		const orderByContext = row;
		if (orderByClause.length > 1) return compiledOrderBy.map((compiled) => compiled.compiledExpression(orderByContext));
		else if (orderByClause.length === 1) return compiledOrderBy[0].compiledExpression(orderByContext);
		return null;
	};
	const compare = (a, b) => {
		if (orderByClause.length > 1) {
			const arrayA = a;
			const arrayB = b;
			for (let i = 0; i < orderByClause.length; i++) {
				const clause = compiledOrderBy[i];
				const result = makeComparator(clause.compareOptions)(arrayA[i], arrayB[i]);
				if (result !== 0) return result;
			}
			return arrayA.length - arrayB.length;
		}
		if (orderByClause.length === 1) {
			const clause = compiledOrderBy[0];
			return makeComparator(clause.compareOptions)(a, b);
		}
		return defaultComparator(a, b);
	};
	let setSizeCallback;
	let orderByOptimizationInfo;
	if (limit && !groupKeyFn && rawQuery.from.type !== `unionFrom` && rawQuery.from.type !== `unionAll`) {
		let index;
		let followRefCollection;
		let firstColumnValueExtractor;
		let orderByAlias = rawQuery.from.alias;
		const firstClause = orderByClause[0];
		const firstOrderByExpression = firstClause.expression;
		if (firstOrderByExpression.type === `ref`) {
			const followRefResult = followRef(rawQuery, firstOrderByExpression, collection);
			if (followRefResult) {
				followRefCollection = followRefResult.collection;
				const fieldName = followRefResult.path[0];
				const compareOpts = buildCompareOptions(firstClause, followRefCollection);
				if (fieldName) {
					const firstColumnCompareFn = makeComparator(compareOpts);
					ensureIndexForField(fieldName, followRefResult.path, followRefCollection, compareOpts, firstColumnCompareFn);
				}
				firstColumnValueExtractor = compileExpression(new PropRef(followRefResult.path), true);
				index = findIndexForField(followRefCollection, followRefResult.path, compareOpts);
				if (!index?.supports(`gt`)) index = void 0;
				if (!index) {
					const collectionId = followRefCollection.id;
					const fieldPath = followRefResult.path.join(`.`);
					console.warn(`[TanStack DB]${collectionId ? ` [${collectionId}]` : ``} orderBy with limit requires an index on "${fieldPath}" for efficient lazy loading. Falling back to loading all data. Consider creating an index on the collection with collection.createIndex((row) => row.${fieldPath}) or enable auto-indexing with autoIndex: 'eager' and a defaultIndexType.`);
				}
				orderByAlias = firstOrderByExpression.path.length > 1 ? String(firstOrderByExpression.path[0]) : rawQuery.from.alias;
			}
		}
		if (!firstColumnValueExtractor);
		else {
			const allColumnExtractors = orderByClause.every((clause) => clause.expression.type === `ref`) ? orderByClause.map((clause) => {
				const refExpr = clause.expression;
				const followResult = followRef(rawQuery, refExpr, collection);
				if (followResult) return compileExpression(new PropRef(followResult.path), true);
				return compileExpression(clause.expression, true);
			}) : void 0;
			const comparator = (a, b) => {
				if (orderByClause.length === 1) return compare(a ? firstColumnValueExtractor(a) : a, b ? firstColumnValueExtractor(b) : b);
				if (allColumnExtractors) {
					const extractAll = (row) => {
						if (!row) return row;
						return allColumnExtractors.map((extractor) => extractor(row));
					};
					return compare(extractAll(a), extractAll(b));
				}
				return 0;
			};
			const rawRowValueExtractor = (row) => {
				if (orderByClause.length === 1) return firstColumnValueExtractor(row);
				if (allColumnExtractors) return allColumnExtractors.map((extractor) => extractor(row));
			};
			orderByOptimizationInfo = {
				alias: orderByAlias,
				offset: offset ?? 0,
				limit,
				comparator,
				valueExtractorForRawRow: rawRowValueExtractor,
				firstColumnValueExtractor,
				index,
				orderBy: orderByClause
			};
			const targetCollectionId = followRefCollection?.id ?? collection.id;
			optimizableOrderByCollections[targetCollectionId] = orderByOptimizationInfo;
			if (index) setSizeCallback = (getSize) => {
				optimizableOrderByCollections[targetCollectionId][`dataNeeded`] = () => {
					const size = getSize();
					return Math.max(0, orderByOptimizationInfo.limit - size);
				};
			};
		}
	}
	if (groupKeyFn) return pipeline.pipe(groupedOrderByWithFractionalIndex(valueExtractor, {
		limit,
		offset,
		comparator: compare,
		setSizeCallback,
		groupKeyFn,
		setWindowFn: (windowFn) => {
			setWindowFn((options) => {
				windowFn(options);
				if (orderByOptimizationInfo) {
					orderByOptimizationInfo.offset = options.offset ?? orderByOptimizationInfo.offset;
					orderByOptimizationInfo.limit = options.limit ?? orderByOptimizationInfo.limit;
				}
			});
		}
	}));
	return pipeline.pipe(orderByWithFractionalIndex(valueExtractor, {
		limit,
		offset,
		comparator: compare,
		setSizeCallback,
		setWindowFn: (windowFn) => {
			setWindowFn((options) => {
				windowFn(options);
				if (orderByOptimizationInfo) {
					orderByOptimizationInfo.offset = options.offset ?? orderByOptimizationInfo.offset;
					orderByOptimizationInfo.limit = options.limit ?? orderByOptimizationInfo.limit;
				}
			});
		}
	}));
}
function buildCompareOptions(clause, collection) {
	if (clause.compareOptions.stringSort !== void 0) return clause.compareOptions;
	return {
		...collection.compareOptions,
		direction: clause.compareOptions.direction,
		nulls: clause.compareOptions.nulls
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/change-events.js
function currentStateAsChanges(collection, options = {}) {
	const collectFilteredResults = (filterFn) => {
		const result = [];
		for (const [key, value] of collection.entries()) if (filterFn?.(value) ?? true) result.push({
			type: `insert`,
			key,
			value
		});
		return result;
	};
	if (options.limit !== void 0 && !options.orderBy) throw new Error(`limit cannot be used without orderBy`);
	if (options.orderBy) {
		const whereFilter = options.where ? createFilterFunctionFromExpression(options.where) : void 0;
		const orderedKeys = getOrderedKeys(collection, options.orderBy, options.limit, whereFilter, options.optimizedOnly);
		if (orderedKeys === void 0) return;
		const result = [];
		for (const key of orderedKeys) {
			const value = collection.get(key);
			if (value !== void 0) result.push({
				type: `insert`,
				key,
				value
			});
		}
		return result;
	}
	if (!options.where) return collectFilteredResults();
	try {
		const expression = options.where;
		const optimizationResult = optimizeExpressionWithIndexes(expression, collection);
		if (optimizationResult.canOptimize) {
			const result = [];
			for (const key of optimizationResult.matchingKeys) {
				const value = collection.get(key);
				if (value !== void 0) result.push({
					type: `insert`,
					key,
					value
				});
			}
			return result;
		} else {
			if (options.optimizedOnly) return;
			return collectFilteredResults(createFilterFunctionFromExpression(expression));
		}
	} catch (error) {
		console.warn(`${collection.id ? `[${collection.id}] ` : ``}Error processing where clause, falling back to full scan:`, error);
		const filterFn = createFilterFunctionFromExpression(options.where);
		if (options.optimizedOnly) return;
		return collectFilteredResults(filterFn);
	}
}
function createFilterFunctionFromExpression(expression) {
	const evaluator = compileSingleRowExpression(expression);
	return (item) => {
		try {
			return toBooleanPredicate(evaluator(item));
		} catch {
			return false;
		}
	};
}
function createFilteredCallback(originalCallback, options) {
	const filterFn = createFilterFunctionFromExpression(options.whereExpression);
	return (changes) => {
		const filteredChanges = [];
		for (const change of changes) if (change.type === `insert`) {
			if (filterFn(change.value)) filteredChanges.push(change);
		} else if (change.type === `update`) {
			const newValueMatches = filterFn(change.value);
			const oldValueMatches = change.previousValue ? filterFn(change.previousValue) : false;
			if (newValueMatches && oldValueMatches) filteredChanges.push(change);
			else if (newValueMatches && !oldValueMatches) filteredChanges.push({
				...change,
				type: `insert`
			});
			else if (!newValueMatches && oldValueMatches) filteredChanges.push({
				...change,
				type: `delete`,
				value: change.previousValue
			});
		} else if (filterFn(change.value)) filteredChanges.push(change);
		if (filteredChanges.length > 0 || changes.length === 0) originalCallback(filteredChanges);
	};
}
function getOrderedKeys(collection, orderBy, limit, whereFilter, optimizedOnly) {
	if (orderBy.length === 1) {
		const clause = orderBy[0];
		const orderByExpression = clause.expression;
		if (orderByExpression.type === `ref`) {
			const fieldPath = orderByExpression.path;
			const compareOpts = buildCompareOptions(clause, collection);
			ensureIndexForField(fieldPath[0], fieldPath, collection, compareOpts);
			const index = findIndexForField(collection, fieldPath, compareOpts);
			if (index && index.supports(`gt`)) {
				const filterFn = (key) => {
					const value = collection.get(key);
					if (value === void 0) return false;
					return whereFilter?.(value) ?? true;
				};
				return index.takeFromStart(limit ?? index.keyCount, filterFn);
			}
		}
	}
	if (optimizedOnly) return;
	const allItems = [];
	for (const [key, value] of collection.entries()) if (whereFilter?.(value) ?? true) allItems.push({
		key,
		value
	});
	const compare = (a, b) => {
		for (const clause of orderBy) {
			const result = makeComparator(clause.compareOptions)(extractValueFromItem(a.value, clause.expression), extractValueFromItem(b.value, clause.expression));
			if (result !== 0) return result;
		}
		return 0;
	};
	allItems.sort(compare);
	const sortedKeys = allItems.map((item) => item.key);
	if (limit !== void 0) return sortedKeys.slice(0, limit);
	return sortedKeys;
}
function extractValueFromItem(item, expression) {
	if (expression.type === `ref`) {
		const propRef = expression;
		let value = item;
		for (const pathPart of propRef.path) value = value?.[pathPart];
		return value;
	} else if (expression.type === `val`) return expression.value;
	else return compileSingleRowExpression(expression)(item);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/SortedMap.js
var SortedMap = class {
	/**
	* Creates a new SortedMap instance
	*
	* @param comparator - Optional function to compare values for sorting.
	*                     If not provided, entries are sorted by key only.
	*/
	constructor(comparator) {
		this.map = /* @__PURE__ */ new Map();
		this.sortedKeys = [];
		this.comparator = comparator;
	}
	/**
	* Finds the index where a key-value pair should be inserted to maintain sort order.
	* Uses binary search to find the correct position based on the value (if comparator provided),
	* with key-based tie-breaking for deterministic ordering when values compare as equal.
	* If no comparator is provided, sorts by key only.
	* Runs in O(log n) time.
	*
	* @param key - The key to find position for (used as tie-breaker or primary sort when no comparator)
	* @param value - The value to compare against (only used if comparator is provided)
	* @returns The index where the key should be inserted
	*/
	indexOf(key, value) {
		let left = 0;
		let right = this.sortedKeys.length;
		if (!this.comparator) {
			while (left < right) {
				const mid = Math.floor((left + right) / 2);
				const midKey = this.sortedKeys[mid];
				const keyComparison = compareKeys(key, midKey);
				if (keyComparison < 0) right = mid;
				else if (keyComparison > 0) left = mid + 1;
				else return mid;
			}
			return left;
		}
		while (left < right) {
			const mid = Math.floor((left + right) / 2);
			const midKey = this.sortedKeys[mid];
			const midValue = this.map.get(midKey);
			const valueComparison = this.comparator(value, midValue);
			if (valueComparison < 0) right = mid;
			else if (valueComparison > 0) left = mid + 1;
			else {
				const keyComparison = compareKeys(key, midKey);
				if (keyComparison < 0) right = mid;
				else if (keyComparison > 0) left = mid + 1;
				else return mid;
			}
		}
		return left;
	}
	/**
	* Sets a key-value pair in the map and maintains sort order
	*
	* @param key - The key to set
	* @param value - The value to associate with the key
	* @returns This SortedMap instance for chaining
	*/
	set(key, value) {
		if (this.map.has(key)) {
			const oldValue = this.map.get(key);
			const oldIndex = this.indexOf(key, oldValue);
			this.sortedKeys.splice(oldIndex, 1);
		}
		const index = this.indexOf(key, value);
		this.sortedKeys.splice(index, 0, key);
		this.map.set(key, value);
		return this;
	}
	/**
	* Gets a value by its key
	*
	* @param key - The key to look up
	* @returns The value associated with the key, or undefined if not found
	*/
	get(key) {
		return this.map.get(key);
	}
	/**
	* Removes a key-value pair from the map
	*
	* @param key - The key to remove
	* @returns True if the key was found and removed, false otherwise
	*/
	delete(key) {
		if (this.map.has(key)) {
			const oldValue = this.map.get(key);
			const index = this.indexOf(key, oldValue);
			this.sortedKeys.splice(index, 1);
			return this.map.delete(key);
		}
		return false;
	}
	/**
	* Checks if a key exists in the map
	*
	* @param key - The key to check
	* @returns True if the key exists, false otherwise
	*/
	has(key) {
		return this.map.has(key);
	}
	/**
	* Removes all key-value pairs from the map
	*/
	clear() {
		this.map.clear();
		this.sortedKeys = [];
	}
	/**
	* Gets the number of key-value pairs in the map
	*/
	get size() {
		return this.map.size;
	}
	/**
	* Default iterator that returns entries in sorted order
	*
	* @returns An iterator for the map's entries
	*/
	*[Symbol.iterator]() {
		for (const key of this.sortedKeys) yield [key, this.map.get(key)];
	}
	/**
	* Returns an iterator for the map's entries in sorted order
	*
	* @returns An iterator for the map's entries
	*/
	entries() {
		return this[Symbol.iterator]();
	}
	/**
	* Returns an iterator for the map's keys in sorted order
	*
	* @returns An iterator for the map's keys
	*/
	keys() {
		return this.sortedKeys[Symbol.iterator]();
	}
	/**
	* Returns an iterator for the map's values in sorted order
	*
	* @returns An iterator for the map's values
	*/
	values() {
		return (function* () {
			for (const key of this.sortedKeys) yield this.map.get(key);
		}).call(this);
	}
	/**
	* Executes a callback function for each key-value pair in the map in sorted order
	*
	* @param callbackfn - Function to execute for each entry
	*/
	forEach(callbackfn) {
		for (const key of this.sortedKeys) callbackfn(this.map.get(key), key, this.map);
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/transaction-metadata.js
var DIRECT_TRANSACTION_METADATA_KEY = `__tanstack_db_direct`;
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/state.js
var CollectionStateManager = class {
	/**
	* Creates a new CollectionState manager
	*/
	constructor(config) {
		this.pendingSyncedTransactions = [];
		this.syncedMetadata = /* @__PURE__ */ new Map();
		this.syncedCollectionMetadata = /* @__PURE__ */ new Map();
		this.optimisticUpserts = /* @__PURE__ */ new Map();
		this.optimisticDeletes = /* @__PURE__ */ new Set();
		this.pendingOptimisticUpserts = /* @__PURE__ */ new Map();
		this.pendingOptimisticDeletes = /* @__PURE__ */ new Set();
		this.pendingOptimisticDirectUpserts = /* @__PURE__ */ new Set();
		this.pendingOptimisticDirectDeletes = /* @__PURE__ */ new Set();
		this.rowOrigins = /* @__PURE__ */ new Map();
		this.pendingLocalChanges = /* @__PURE__ */ new Set();
		this.pendingLocalOrigins = /* @__PURE__ */ new Set();
		this.virtualPropsCache = /* @__PURE__ */ new WeakMap();
		this.size = 0;
		this.syncedKeys = /* @__PURE__ */ new Set();
		this.preSyncVisibleState = /* @__PURE__ */ new Map();
		this.recentlySyncedKeys = /* @__PURE__ */ new Set();
		this.hasReceivedFirstCommit = false;
		this.isCommittingSyncTransactions = false;
		this.isLocalOnly = false;
		this.commitPendingTransactions = () => {
			let hasPersistingTransaction = false;
			for (const transaction of this.transactions.values()) if (transaction.state === `persisting`) {
				hasPersistingTransaction = true;
				break;
			}
			const { committedSyncedTransactions, uncommittedSyncedTransactions, hasTruncateSync, hasImmediateSync } = this.pendingSyncedTransactions.reduce((acc, t) => {
				if (t.committed) {
					acc.committedSyncedTransactions.push(t);
					if (t.truncate) acc.hasTruncateSync = true;
					if (t.immediate) acc.hasImmediateSync = true;
				} else acc.uncommittedSyncedTransactions.push(t);
				return acc;
			}, {
				committedSyncedTransactions: [],
				uncommittedSyncedTransactions: [],
				hasTruncateSync: false,
				hasImmediateSync: false
			});
			if (!hasPersistingTransaction || hasTruncateSync || hasImmediateSync) {
				this.isCommittingSyncTransactions = true;
				const previousRowOrigins = new Map(this.rowOrigins);
				const previousOptimisticUpserts = new Map(this.optimisticUpserts);
				const previousOptimisticDeletes = new Set(this.optimisticDeletes);
				const truncateOptimisticSnapshot = hasTruncateSync ? committedSyncedTransactions.find((t) => t.truncate)?.optimisticSnapshot : null;
				let truncatePendingLocalChanges;
				let truncatePendingLocalOrigins;
				const changedKeys = /* @__PURE__ */ new Set();
				for (const transaction of committedSyncedTransactions) {
					for (const operation of transaction.operations) changedKeys.add(operation.key);
					for (const [key] of transaction.rowMetadataWrites) changedKeys.add(key);
				}
				let currentVisibleState = this.preSyncVisibleState;
				if (currentVisibleState.size === 0) {
					currentVisibleState = /* @__PURE__ */ new Map();
					for (const key of changedKeys) {
						const currentValue = this.get(key);
						if (currentValue !== void 0) currentVisibleState.set(key, currentValue);
					}
				}
				const events = [];
				const rowUpdateMode = this.config.sync.rowUpdateMode || `partial`;
				const completedOptimisticOps = /* @__PURE__ */ new Map();
				for (const transaction of this.transactions.values()) if (transaction.state === `completed`) {
					for (const mutation of transaction.mutations) if (this.isThisCollection(mutation.collection)) {
						if (mutation.optimistic) completedOptimisticOps.set(mutation.key, {
							type: mutation.type,
							value: mutation.modified
						});
					}
				}
				for (const transaction of committedSyncedTransactions) {
					if (transaction.truncate) {
						const visibleKeys = /* @__PURE__ */ new Set([...this.syncedData.keys(), ...truncateOptimisticSnapshot?.upserts.keys() || []]);
						for (const key of visibleKeys) {
							if (truncateOptimisticSnapshot?.deletes.has(key)) continue;
							const previousValue = truncateOptimisticSnapshot?.upserts.get(key) || this.syncedData.get(key);
							if (previousValue !== void 0) events.push({
								type: `delete`,
								key,
								value: previousValue
							});
						}
						truncatePendingLocalChanges = new Set(this.pendingLocalChanges);
						truncatePendingLocalOrigins = new Set(this.pendingLocalOrigins);
						this.syncedData.clear();
						this.syncedMetadata.clear();
						this.syncedKeys.clear();
						this.clearOriginTrackingState();
						for (const key of changedKeys) currentVisibleState.delete(key);
						this._events.emit(`truncate`, {
							type: `truncate`,
							collection: this.collection
						});
					}
					for (const operation of transaction.operations) {
						const key = operation.key;
						this.syncedKeys.add(key);
						const origin = this.isLocalOnly || this.pendingLocalChanges.has(key) || this.pendingLocalOrigins.has(key) || truncatePendingLocalChanges?.has(key) === true || truncatePendingLocalOrigins?.has(key) === true ? "local" : "remote";
						switch (operation.type) {
							case `insert`:
								this.syncedData.set(key, operation.value);
								this.rowOrigins.set(key, origin);
								this.pendingLocalChanges.delete(key);
								this.pendingLocalOrigins.delete(key);
								this.pendingOptimisticUpserts.delete(key);
								this.pendingOptimisticDeletes.delete(key);
								this.pendingOptimisticDirectUpserts.delete(key);
								this.pendingOptimisticDirectDeletes.delete(key);
								break;
							case `update`:
								if (rowUpdateMode === `partial`) {
									const updatedValue = Object.assign({}, this.syncedData.get(key), operation.value);
									this.syncedData.set(key, updatedValue);
								} else this.syncedData.set(key, operation.value);
								this.rowOrigins.set(key, origin);
								this.pendingLocalChanges.delete(key);
								this.pendingLocalOrigins.delete(key);
								this.pendingOptimisticUpserts.delete(key);
								this.pendingOptimisticDeletes.delete(key);
								this.pendingOptimisticDirectUpserts.delete(key);
								this.pendingOptimisticDirectDeletes.delete(key);
								break;
							case `delete`:
								this.syncedData.delete(key);
								this.syncedMetadata.delete(key);
								this.rowOrigins.delete(key);
								this.pendingLocalChanges.delete(key);
								this.pendingLocalOrigins.delete(key);
								this.pendingOptimisticUpserts.delete(key);
								this.pendingOptimisticDeletes.delete(key);
								this.pendingOptimisticDirectUpserts.delete(key);
								this.pendingOptimisticDirectDeletes.delete(key);
								break;
						}
					}
					for (const [key, metadataWrite] of transaction.rowMetadataWrites) {
						if (metadataWrite.type === `delete`) {
							this.syncedMetadata.delete(key);
							continue;
						}
						this.syncedMetadata.set(key, metadataWrite.value);
					}
					for (const [key, metadataWrite] of transaction.collectionMetadataWrites) {
						if (metadataWrite.type === `delete`) {
							this.syncedCollectionMetadata.delete(key);
							continue;
						}
						this.syncedCollectionMetadata.set(key, metadataWrite.value);
					}
				}
				if (hasTruncateSync) {
					const syncedInsertedOrUpdatedKeys = /* @__PURE__ */ new Set();
					for (const t of committedSyncedTransactions) for (const op of t.operations) if (op.type === `insert` || op.type === `update`) syncedInsertedOrUpdatedKeys.add(op.key);
					const reapplyUpserts = new Map(truncateOptimisticSnapshot.upserts);
					const reapplyDeletes = new Set(truncateOptimisticSnapshot.deletes);
					for (const [key, value] of reapplyUpserts) {
						if (reapplyDeletes.has(key)) continue;
						if (syncedInsertedOrUpdatedKeys.has(key)) {
							let foundInsert = false;
							for (let i = events.length - 1; i >= 0; i--) {
								const evt = events[i];
								if (evt.key === key && evt.type === `insert`) {
									evt.value = value;
									foundInsert = true;
									break;
								}
							}
							if (!foundInsert) events.push({
								type: `insert`,
								key,
								value
							});
						} else events.push({
							type: `insert`,
							key,
							value
						});
					}
					if (events.length > 0 && reapplyDeletes.size > 0) {
						const filtered = [];
						for (const evt of events) {
							if (evt.type === `insert` && reapplyDeletes.has(evt.key)) continue;
							filtered.push(evt);
						}
						events.length = 0;
						events.push(...filtered);
					}
					if (this.lifecycle.status !== `ready`) this.lifecycle.markReady();
				}
				this.optimisticUpserts.clear();
				this.optimisticDeletes.clear();
				this.isCommittingSyncTransactions = false;
				if (hasTruncateSync && truncateOptimisticSnapshot) {
					for (const [key, value] of truncateOptimisticSnapshot.upserts) this.optimisticUpserts.set(key, value);
					for (const key of truncateOptimisticSnapshot.deletes) this.optimisticDeletes.add(key);
				}
				for (const transaction of this.transactions.values()) if (![`completed`, `failed`].includes(transaction.state)) {
					for (const mutation of transaction.mutations) if (this.isThisCollection(mutation.collection) && mutation.optimistic) switch (mutation.type) {
						case `insert`:
						case `update`:
							this.optimisticUpserts.set(mutation.key, mutation.modified);
							this.optimisticDeletes.delete(mutation.key);
							break;
						case `delete`:
							this.optimisticUpserts.delete(mutation.key);
							this.optimisticDeletes.add(mutation.key);
							break;
					}
				}
				for (const key of this.pendingOptimisticDirectUpserts) if (!changedKeys.has(key)) {
					changedKeys.add(key);
					if (!currentVisibleState.has(key)) {
						const previousValue = previousOptimisticUpserts.get(key);
						if (previousValue !== void 0) currentVisibleState.set(key, previousValue);
					}
					this.pendingOptimisticUpserts.delete(key);
					this.pendingLocalOrigins.delete(key);
				}
				for (const key of this.pendingOptimisticDirectDeletes) {
					if (!changedKeys.has(key)) changedKeys.add(key);
					this.pendingOptimisticDeletes.delete(key);
					this.pendingLocalOrigins.delete(key);
				}
				this.pendingOptimisticDirectUpserts.clear();
				this.pendingOptimisticDirectDeletes.clear();
				for (const key of changedKeys) {
					const previousVisibleValue = currentVisibleState.get(key);
					const newVisibleValue = this.get(key);
					const previousVirtualProps = this.getVirtualPropsSnapshotForState(key, {
						rowOrigins: previousRowOrigins,
						optimisticUpserts: previousOptimisticUpserts,
						optimisticDeletes: previousOptimisticDeletes,
						completedOptimisticKeys: completedOptimisticOps
					});
					const nextVirtualProps = this.getVirtualPropsSnapshotForState(key);
					const virtualChanged = previousVirtualProps.$synced !== nextVirtualProps.$synced || previousVirtualProps.$origin !== nextVirtualProps.$origin;
					const previousValueWithVirtual = previousVisibleValue !== void 0 ? enrichRowWithVirtualProps(previousVisibleValue, key, this.collection.id, () => previousVirtualProps.$synced, () => previousVirtualProps.$origin) : void 0;
					const completedOp = completedOptimisticOps.get(key);
					let isRedundantSync = false;
					if (completedOp) {
						if (completedOp.type === `delete` && previousVisibleValue !== void 0 && newVisibleValue === void 0 && deepEquals(completedOp.value, previousVisibleValue)) isRedundantSync = true;
						else if (newVisibleValue !== void 0 && deepEquals(completedOp.value, newVisibleValue)) isRedundantSync = true;
					}
					const shouldEmitVirtualUpdate = virtualChanged && previousVisibleValue !== void 0 && newVisibleValue !== void 0 && deepEquals(previousVisibleValue, newVisibleValue);
					if (isRedundantSync && !shouldEmitVirtualUpdate) continue;
					if (previousVisibleValue === void 0 && newVisibleValue !== void 0) {
						const completedOptimisticOp = completedOptimisticOps.get(key);
						if (completedOptimisticOp) {
							const previousValueFromCompleted = completedOptimisticOp.value;
							const previousValueWithVirtualFromCompleted = enrichRowWithVirtualProps(previousValueFromCompleted, key, this.collection.id, () => previousVirtualProps.$synced, () => previousVirtualProps.$origin);
							events.push({
								type: `update`,
								key,
								value: newVisibleValue,
								previousValue: previousValueWithVirtualFromCompleted
							});
						} else events.push({
							type: `insert`,
							key,
							value: newVisibleValue
						});
					} else if (previousVisibleValue !== void 0 && newVisibleValue === void 0) events.push({
						type: `delete`,
						key,
						value: previousValueWithVirtual ?? previousVisibleValue
					});
					else if (previousVisibleValue !== void 0 && newVisibleValue !== void 0 && (!deepEquals(previousVisibleValue, newVisibleValue) || shouldEmitVirtualUpdate)) events.push({
						type: `update`,
						key,
						value: newVisibleValue,
						previousValue: previousValueWithVirtual ?? previousVisibleValue
					});
				}
				this.size = this.calculateSize();
				if (events.length > 0) this.indexes.updateIndexes(events);
				this.changes.emitEvents(events, true);
				this.pendingSyncedTransactions = uncommittedSyncedTransactions;
				this.preSyncVisibleState.clear();
				Promise.resolve().then(() => {
					this.recentlySyncedKeys.clear();
				});
				if (!this.hasReceivedFirstCommit) this.hasReceivedFirstCommit = true;
			}
		};
		this.config = config;
		this.transactions = new SortedMap((a, b) => a.compareCreatedAt(b));
		this.syncedData = new SortedMap(config.compare);
	}
	setDeps(deps) {
		this.collection = deps.collection;
		this.lifecycle = deps.lifecycle;
		this.changes = deps.changes;
		this.indexes = deps.indexes;
		this._events = deps.events;
	}
	/**
	* Checks if a row has pending optimistic mutations (not yet confirmed by sync).
	* Used to compute the $synced virtual property.
	*/
	isRowSynced(key) {
		if (this.isLocalOnly) return true;
		return !this.optimisticUpserts.has(key) && !this.optimisticDeletes.has(key);
	}
	/**
	* Gets the origin of the last confirmed change to a row.
	* Returns 'local' if the row has optimistic mutations (optimistic changes are local).
	* Used to compute the $origin virtual property.
	*/
	getRowOrigin(key) {
		if (this.isLocalOnly) return "local";
		if (this.optimisticUpserts.has(key) || this.optimisticDeletes.has(key)) return "local";
		return this.rowOrigins.get(key) ?? "remote";
	}
	createVirtualPropsSnapshot(key, overrides) {
		return {
			$synced: overrides?.$synced ?? this.isRowSynced(key),
			$origin: overrides?.$origin ?? this.getRowOrigin(key),
			$key: overrides?.$key ?? key,
			$collectionId: overrides?.$collectionId ?? this.collection.id
		};
	}
	getVirtualPropsSnapshotForState(key, options) {
		if (this.isLocalOnly) return this.createVirtualPropsSnapshot(key, {
			$synced: true,
			$origin: "local"
		});
		const optimisticUpserts = options?.optimisticUpserts ?? this.optimisticUpserts;
		const optimisticDeletes = options?.optimisticDeletes ?? this.optimisticDeletes;
		const hasOptimisticChange = optimisticUpserts.has(key) || optimisticDeletes.has(key) || options?.completedOptimisticKeys?.has(key) === true;
		return this.createVirtualPropsSnapshot(key, {
			$synced: !hasOptimisticChange,
			$origin: hasOptimisticChange ? "local" : (options?.rowOrigins ?? this.rowOrigins).get(key) ?? "remote"
		});
	}
	enrichWithVirtualPropsSnapshot(row, virtualProps) {
		const existingRow = row;
		const synced = existingRow.$synced ?? virtualProps.$synced;
		const origin = existingRow.$origin ?? virtualProps.$origin;
		const resolvedKey = existingRow.$key ?? virtualProps.$key;
		const collectionId = existingRow.$collectionId ?? virtualProps.$collectionId;
		const cached = this.virtualPropsCache.get(row);
		if (cached && cached.synced === synced && cached.origin === origin && cached.key === resolvedKey && cached.collectionId === collectionId) return cached.enriched;
		const enriched = {
			...row,
			$synced: synced,
			$origin: origin,
			$key: resolvedKey,
			$collectionId: collectionId
		};
		this.virtualPropsCache.set(row, {
			synced,
			origin,
			key: resolvedKey,
			collectionId,
			enriched
		});
		return enriched;
	}
	clearOriginTrackingState() {
		this.rowOrigins.clear();
		this.pendingLocalChanges.clear();
		this.pendingLocalOrigins.clear();
	}
	/**
	* Enriches a row with virtual properties using the "add-if-missing" pattern.
	* If the row already has virtual properties (from an upstream collection),
	* they are preserved. Otherwise, new values are computed.
	*/
	enrichWithVirtualProps(row, key) {
		return this.enrichWithVirtualPropsSnapshot(row, this.createVirtualPropsSnapshot(key));
	}
	/**
	* Creates a change message with virtual properties.
	* Uses the "add-if-missing" pattern so that pass-through from upstream
	* collections works correctly.
	*/
	enrichChangeMessage(change) {
		const { __virtualProps } = change;
		const enrichedValue = __virtualProps?.value ? this.enrichWithVirtualPropsSnapshot(change.value, __virtualProps.value) : this.enrichWithVirtualProps(change.value, change.key);
		const enrichedPreviousValue = change.previousValue ? __virtualProps?.previousValue ? this.enrichWithVirtualPropsSnapshot(change.previousValue, __virtualProps.previousValue) : this.enrichWithVirtualProps(change.previousValue, change.key) : void 0;
		return {
			key: change.key,
			type: change.type,
			value: enrichedValue,
			previousValue: enrichedPreviousValue,
			metadata: change.metadata
		};
	}
	/**
	* Get the current value for a key enriched with virtual properties.
	*/
	getWithVirtualProps(key) {
		const value = this.get(key);
		if (value === void 0) return;
		return this.enrichWithVirtualProps(value, key);
	}
	/**
	* Get the current value for a key (virtual derived state)
	*/
	get(key) {
		const { optimisticDeletes, optimisticUpserts, syncedData } = this;
		if (optimisticDeletes.has(key)) return;
		if (optimisticUpserts.has(key)) return optimisticUpserts.get(key);
		return syncedData.get(key);
	}
	/**
	* Check if a key exists in the collection (virtual derived state)
	*/
	has(key) {
		const { optimisticDeletes, optimisticUpserts, syncedData } = this;
		if (optimisticDeletes.has(key)) return false;
		if (optimisticUpserts.has(key)) return true;
		return syncedData.has(key);
	}
	/**
	* Get all keys (virtual derived state)
	*/
	*keys() {
		const { syncedData, optimisticDeletes, optimisticUpserts } = this;
		for (const key of syncedData.keys()) if (!optimisticDeletes.has(key)) yield key;
		for (const key of optimisticUpserts.keys()) if (!syncedData.has(key) && !optimisticDeletes.has(key)) yield key;
	}
	/**
	* Get all values (virtual derived state)
	*/
	*values() {
		for (const key of this.keys()) {
			const value = this.get(key);
			if (value !== void 0) yield value;
		}
	}
	/**
	* Get all entries (virtual derived state)
	*/
	*entries() {
		for (const key of this.keys()) {
			const value = this.get(key);
			if (value !== void 0) yield [key, value];
		}
	}
	/**
	* Get all entries (virtual derived state)
	*/
	*[Symbol.iterator]() {
		for (const [key, value] of this.entries()) yield [key, value];
	}
	/**
	* Execute a callback for each entry in the collection
	*/
	forEach(callbackfn) {
		let index = 0;
		for (const [key, value] of this.entries()) callbackfn(value, key, index++);
	}
	/**
	* Create a new array with the results of calling a function for each entry in the collection
	*/
	map(callbackfn) {
		const result = [];
		let index = 0;
		for (const [key, value] of this.entries()) result.push(callbackfn(value, key, index++));
		return result;
	}
	/**
	* Check if the given collection is this collection
	* @param collection The collection to check
	* @returns True if the given collection is this collection, false otherwise
	*/
	isThisCollection(collection) {
		return collection === this.collection;
	}
	/**
	* Recompute optimistic state from active transactions
	*/
	recomputeOptimisticState(triggeredByUserAction = false) {
		if (this.isCommittingSyncTransactions && !triggeredByUserAction) return;
		const previousState = new Map(this.optimisticUpserts);
		const previousDeletes = new Set(this.optimisticDeletes);
		const previousRowOrigins = new Map(this.rowOrigins);
		for (const transaction of this.transactions.values()) {
			const isDirectTransaction = transaction.metadata[DIRECT_TRANSACTION_METADATA_KEY] === true;
			if (transaction.state === `completed`) for (const mutation of transaction.mutations) {
				if (!this.isThisCollection(mutation.collection)) continue;
				this.pendingLocalOrigins.add(mutation.key);
				if (!mutation.optimistic) continue;
				switch (mutation.type) {
					case `insert`:
					case `update`:
						this.pendingOptimisticUpserts.set(mutation.key, mutation.modified);
						this.pendingOptimisticDeletes.delete(mutation.key);
						if (isDirectTransaction) {
							this.pendingOptimisticDirectUpserts.add(mutation.key);
							this.pendingOptimisticDirectDeletes.delete(mutation.key);
						} else {
							this.pendingOptimisticDirectUpserts.delete(mutation.key);
							this.pendingOptimisticDirectDeletes.delete(mutation.key);
						}
						break;
					case `delete`:
						this.pendingOptimisticUpserts.delete(mutation.key);
						this.pendingOptimisticDeletes.add(mutation.key);
						if (isDirectTransaction) {
							this.pendingOptimisticDirectUpserts.delete(mutation.key);
							this.pendingOptimisticDirectDeletes.add(mutation.key);
						} else {
							this.pendingOptimisticDirectUpserts.delete(mutation.key);
							this.pendingOptimisticDirectDeletes.delete(mutation.key);
						}
						break;
				}
			}
			else if (transaction.state === `failed`) for (const mutation of transaction.mutations) {
				if (!this.isThisCollection(mutation.collection)) continue;
				this.pendingLocalOrigins.delete(mutation.key);
				if (mutation.optimistic) {
					this.pendingOptimisticUpserts.delete(mutation.key);
					this.pendingOptimisticDeletes.delete(mutation.key);
					this.pendingOptimisticDirectUpserts.delete(mutation.key);
					this.pendingOptimisticDirectDeletes.delete(mutation.key);
				}
			}
		}
		this.optimisticUpserts.clear();
		this.optimisticDeletes.clear();
		this.pendingLocalChanges.clear();
		const pendingSyncKeys = /* @__PURE__ */ new Set();
		for (const transaction of this.pendingSyncedTransactions) for (const operation of transaction.operations) pendingSyncKeys.add(operation.key);
		const staleOptimisticUpserts = [];
		for (const [key, value] of this.pendingOptimisticUpserts) if (pendingSyncKeys.has(key) || this.pendingOptimisticDirectUpserts.has(key)) this.optimisticUpserts.set(key, value);
		else staleOptimisticUpserts.push(key);
		for (const key of staleOptimisticUpserts) {
			this.pendingOptimisticUpserts.delete(key);
			this.pendingLocalOrigins.delete(key);
		}
		const staleOptimisticDeletes = [];
		for (const key of this.pendingOptimisticDeletes) if (pendingSyncKeys.has(key) || this.pendingOptimisticDirectDeletes.has(key)) this.optimisticDeletes.add(key);
		else staleOptimisticDeletes.push(key);
		for (const key of staleOptimisticDeletes) {
			this.pendingOptimisticDeletes.delete(key);
			this.pendingLocalOrigins.delete(key);
		}
		const activeTransactions = [];
		for (const transaction of this.transactions.values()) if (![`completed`, `failed`].includes(transaction.state)) activeTransactions.push(transaction);
		for (const transaction of activeTransactions) for (const mutation of transaction.mutations) {
			if (!this.isThisCollection(mutation.collection)) continue;
			this.pendingLocalChanges.add(mutation.key);
			if (mutation.optimistic) switch (mutation.type) {
				case `insert`:
				case `update`:
					this.optimisticUpserts.set(mutation.key, mutation.modified);
					this.optimisticDeletes.delete(mutation.key);
					break;
				case `delete`:
					this.optimisticUpserts.delete(mutation.key);
					this.optimisticDeletes.add(mutation.key);
					break;
			}
		}
		this.size = this.calculateSize();
		const events = [];
		this.collectOptimisticChanges(previousState, previousDeletes, previousRowOrigins, events);
		const filteredEventsBySyncStatus = events.filter((event) => {
			if (!this.recentlySyncedKeys.has(event.key)) return true;
			if (triggeredByUserAction) return true;
			return false;
		});
		if (this.pendingSyncedTransactions.length > 0 && !triggeredByUserAction) {
			const pendingSyncKeysForFilter = /* @__PURE__ */ new Set();
			for (const transaction of this.pendingSyncedTransactions) for (const operation of transaction.operations) pendingSyncKeysForFilter.add(operation.key);
			const filteredEvents = filteredEventsBySyncStatus.filter((event) => {
				if (event.type === `delete` && pendingSyncKeysForFilter.has(event.key)) {
					if (!activeTransactions.some((tx) => tx.mutations.some((m) => this.isThisCollection(m.collection) && m.key === event.key))) return false;
				}
				return true;
			});
			if (filteredEvents.length > 0) this.indexes.updateIndexes(filteredEvents);
			this.changes.emitEvents(filteredEvents, triggeredByUserAction);
		} else {
			if (filteredEventsBySyncStatus.length > 0) this.indexes.updateIndexes(filteredEventsBySyncStatus);
			this.changes.emitEvents(filteredEventsBySyncStatus, triggeredByUserAction);
		}
	}
	/**
	* Calculate the current size based on synced data and optimistic changes
	*/
	calculateSize() {
		const syncedSize = this.syncedData.size;
		const deletesFromSynced = Array.from(this.optimisticDeletes).filter((key) => this.syncedData.has(key) && !this.optimisticUpserts.has(key)).length;
		const upsertsNotInSynced = Array.from(this.optimisticUpserts.keys()).filter((key) => !this.syncedData.has(key)).length;
		return syncedSize - deletesFromSynced + upsertsNotInSynced;
	}
	/**
	* Collect events for optimistic changes
	*/
	collectOptimisticChanges(previousUpserts, previousDeletes, previousRowOrigins, events) {
		const allKeys = /* @__PURE__ */ new Set([
			...previousUpserts.keys(),
			...this.optimisticUpserts.keys(),
			...previousDeletes,
			...this.optimisticDeletes
		]);
		for (const key of allKeys) {
			const currentValue = this.get(key);
			const previousValue = this.getPreviousValue(key, previousUpserts, previousDeletes);
			const previousVirtualProps = this.getVirtualPropsSnapshotForState(key, {
				rowOrigins: previousRowOrigins,
				optimisticUpserts: previousUpserts,
				optimisticDeletes: previousDeletes
			});
			const nextVirtualProps = this.getVirtualPropsSnapshotForState(key);
			if (previousValue !== void 0 && currentValue === void 0) events.push({
				type: `delete`,
				key,
				value: previousValue,
				__virtualProps: { value: previousVirtualProps }
			});
			else if (previousValue === void 0 && currentValue !== void 0) events.push({
				type: `insert`,
				key,
				value: currentValue,
				__virtualProps: { value: nextVirtualProps }
			});
			else if (previousValue !== void 0 && currentValue !== void 0 && previousValue !== currentValue) events.push({
				type: `update`,
				key,
				value: currentValue,
				previousValue,
				__virtualProps: {
					value: nextVirtualProps,
					previousValue: previousVirtualProps
				}
			});
		}
	}
	/**
	* Get the previous value for a key given previous optimistic state
	*/
	getPreviousValue(key, previousUpserts, previousDeletes) {
		if (previousDeletes.has(key)) return;
		if (previousUpserts.has(key)) return previousUpserts.get(key);
		return this.syncedData.get(key);
	}
	/**
	* Schedule cleanup of a transaction when it completes
	*/
	scheduleTransactionCleanup(transaction) {
		if (transaction.state === `completed`) {
			this.transactions.delete(transaction.id);
			return;
		}
		transaction.isPersisted.promise.then(() => {
			this.transactions.delete(transaction.id);
		}).catch(() => {});
	}
	/**
	* Capture visible state for keys that will be affected by pending sync operations
	* This must be called BEFORE onTransactionStateChange clears optimistic state
	*/
	capturePreSyncVisibleState() {
		if (this.pendingSyncedTransactions.length === 0) return;
		const syncedKeys = /* @__PURE__ */ new Set();
		for (const transaction of this.pendingSyncedTransactions) for (const operation of transaction.operations) syncedKeys.add(operation.key);
		for (const key of syncedKeys) this.recentlySyncedKeys.add(key);
		for (const key of syncedKeys) if (!this.preSyncVisibleState.has(key)) {
			const currentValue = this.get(key);
			if (currentValue !== void 0) this.preSyncVisibleState.set(key, currentValue);
		}
	}
	/**
	* Trigger a recomputation when transactions change
	* This method should be called by the Transaction class when state changes
	*/
	onTransactionStateChange() {
		this.changes.shouldBatchEvents = this.pendingSyncedTransactions.length > 0;
		this.capturePreSyncVisibleState();
		this.recomputeOptimisticState(false);
	}
	/**
	* Clean up the collection by stopping sync and clearing data
	* This can be called manually or automatically by garbage collection
	*/
	cleanup() {
		this.syncedData.clear();
		this.syncedMetadata.clear();
		this.syncedCollectionMetadata.clear();
		this.optimisticUpserts.clear();
		this.optimisticDeletes.clear();
		this.pendingOptimisticUpserts.clear();
		this.pendingOptimisticDeletes.clear();
		this.pendingOptimisticDirectUpserts.clear();
		this.pendingOptimisticDirectDeletes.clear();
		this.clearOriginTrackingState();
		this.isLocalOnly = false;
		this.size = 0;
		this.pendingSyncedTransactions = [];
		this.syncedKeys.clear();
		this.hasReceivedFirstCommit = false;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/builder/ref-proxy.js
function createSingleRowRefProxy() {
	const cache = /* @__PURE__ */ new Map();
	function createProxy(path) {
		const pathKey = path.join(`.`);
		if (cache.has(pathKey)) return cache.get(pathKey);
		const proxy = new Proxy({}, {
			get(target, prop, receiver) {
				if (prop === `__refProxy`) return true;
				if (prop === `__path`) return path;
				if (prop === `__type`) return void 0;
				if (typeof prop === `symbol`) return Reflect.get(target, prop, receiver);
				return createProxy([...path, String(prop)]);
			},
			has(target, prop) {
				if (prop === `__refProxy` || prop === `__path` || prop === `__type`) return true;
				return Reflect.has(target, prop);
			},
			ownKeys(target) {
				return Reflect.ownKeys(target);
			},
			getOwnPropertyDescriptor(target, prop) {
				if (prop === `__refProxy` || prop === `__path` || prop === `__type`) return {
					enumerable: false,
					configurable: true
				};
				return Reflect.getOwnPropertyDescriptor(target, prop);
			}
		});
		cache.set(pathKey, proxy);
		return proxy;
	}
	return createProxy([]);
}
function createRefProxy(aliases) {
	const cache = /* @__PURE__ */ new Map();
	let accessId = 0;
	function createProxy(path) {
		const pathKey = path.join(`.`);
		if (cache.has(pathKey)) return cache.get(pathKey);
		const proxy = new Proxy({}, {
			get(target, prop, receiver) {
				if (prop === `__refProxy`) return true;
				if (prop === `__path`) return path;
				if (prop === `__type`) return void 0;
				if (typeof prop === `symbol`) return Reflect.get(target, prop, receiver);
				return createProxy([...path, String(prop)]);
			},
			has(target, prop) {
				if (prop === `__refProxy` || prop === `__path` || prop === `__type`) return true;
				return Reflect.has(target, prop);
			},
			ownKeys(target) {
				const id = ++accessId;
				const sentinelKey = `__SPREAD_SENTINEL__${path.join(`.`)}__${id}`;
				if (!Object.prototype.hasOwnProperty.call(target, sentinelKey)) Object.defineProperty(target, sentinelKey, {
					enumerable: true,
					configurable: true,
					value: true
				});
				return Reflect.ownKeys(target);
			},
			getOwnPropertyDescriptor(target, prop) {
				if (prop === `__refProxy` || prop === `__path` || prop === `__type`) return {
					enumerable: false,
					configurable: true
				};
				return Reflect.getOwnPropertyDescriptor(target, prop);
			}
		});
		cache.set(pathKey, proxy);
		return proxy;
	}
	return new Proxy({}, {
		get(target, prop, receiver) {
			if (prop === `__refProxy`) return true;
			if (prop === `__path`) return [];
			if (prop === `__type`) return void 0;
			if (typeof prop === `symbol`) return Reflect.get(target, prop, receiver);
			const propStr = String(prop);
			if (aliases.includes(propStr) || aliases.includes(`*`)) return createProxy([propStr]);
		},
		has(target, prop) {
			if (prop === `__refProxy` || prop === `__path` || prop === `__type`) return true;
			if (typeof prop === `string` && aliases.includes(prop)) return true;
			return Reflect.has(target, prop);
		},
		ownKeys(_target) {
			return [
				...aliases,
				`__refProxy`,
				`__path`,
				`__type`
			];
		},
		getOwnPropertyDescriptor(target, prop) {
			if (prop === `__refProxy` || prop === `__path` || prop === `__type`) return {
				enumerable: false,
				configurable: true
			};
			if (typeof prop === `string` && aliases.includes(prop)) return {
				enumerable: true,
				configurable: true
			};
		}
	});
}
function createRefProxyWithSelected(aliases) {
	const baseProxy = createRefProxy(aliases);
	const cache = /* @__PURE__ */ new Map();
	function createSelectedProxy(path) {
		const pathKey = path.join(`.`);
		if (cache.has(pathKey)) return cache.get(pathKey);
		const proxy = new Proxy({}, {
			get(target, prop, receiver) {
				if (prop === `__refProxy`) return true;
				if (prop === `__path`) return [`$selected`, ...path];
				if (prop === `__type`) return void 0;
				if (typeof prop === `symbol`) return Reflect.get(target, prop, receiver);
				return createSelectedProxy([...path, String(prop)]);
			},
			has(target, prop) {
				if (prop === `__refProxy` || prop === `__path` || prop === `__type`) return true;
				return Reflect.has(target, prop);
			},
			ownKeys(target) {
				return Reflect.ownKeys(target);
			},
			getOwnPropertyDescriptor(target, prop) {
				if (prop === `__refProxy` || prop === `__path` || prop === `__type`) return {
					enumerable: false,
					configurable: true
				};
				return Reflect.getOwnPropertyDescriptor(target, prop);
			}
		});
		cache.set(pathKey, proxy);
		return proxy;
	}
	const wrappedSelectedProxy = createSelectedProxy([]);
	return new Proxy(baseProxy, {
		get(target, prop, receiver) {
			if (prop === `$selected`) return wrappedSelectedProxy;
			return Reflect.get(target, prop, receiver);
		},
		has(target, prop) {
			if (prop === `$selected`) return true;
			return Reflect.has(target, prop);
		},
		ownKeys(target) {
			return [...Reflect.ownKeys(target), `$selected`];
		},
		getOwnPropertyDescriptor(target, prop) {
			if (prop === `$selected`) return {
				enumerable: true,
				configurable: true,
				value: wrappedSelectedProxy
			};
			return Reflect.getOwnPropertyDescriptor(target, prop);
		}
	});
}
function toExpression(value) {
	if (isRefProxy(value)) return new PropRef(value.__path);
	if (value && typeof value === `object` && (value.__brand === `ToArrayWrapper` || value.__brand === `ConcatToArrayWrapper` || value.__brand === `CaseWhenWrapper`)) {
		const name = value.__brand === `ToArrayWrapper` ? `toArray()` : value.__brand === `ConcatToArrayWrapper` ? `concat(toArray())` : `caseWhen()`;
		throw new Error(`${name} cannot be used inside expressions (e.g., coalesce(), eq(), not()). Use ${name} directly as a select field value instead.`);
	}
	if (value && typeof value === `object` && `type` in value && (value.type === `func` || value.type === `ref` || value.type === `val` || value.type === `agg`)) return value;
	return new Value(value);
}
function isRefProxy(value) {
	return value && typeof value === `object` && value.__refProxy === true;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/builder/functions.js
function eq(left, right) {
	return new Func(`eq`, [toExpression(left), toExpression(right)]);
}
function gt(left, right) {
	return new Func(`gt`, [toExpression(left), toExpression(right)]);
}
function gte(left, right) {
	return new Func(`gte`, [toExpression(left), toExpression(right)]);
}
function lt(left, right) {
	return new Func(`lt`, [toExpression(left), toExpression(right)]);
}
function and(left, right, ...rest) {
	return new Func(`and`, [
		left,
		right,
		...rest
	].map((arg) => toExpression(arg)));
}
function or(left, right, ...rest) {
	return new Func(`or`, [
		left,
		right,
		...rest
	].map((arg) => toExpression(arg)));
}
function inArray(value, array) {
	return new Func(`in`, [toExpression(value), toExpression(array)]);
}
var ToArrayWrapper = class {
	constructor(query) {
		this.query = query;
		this.__brand = `ToArrayWrapper`;
	}
};
var ConcatToArrayWrapper = class {
	constructor(query) {
		this.query = query;
		this.__brand = `ConcatToArrayWrapper`;
	}
};
var CaseWhenWrapper = class {
	constructor(args) {
		this.args = args;
		this.__brand = `CaseWhenWrapper`;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/event-emitter.js
var EventEmitter = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Map();
	}
	/**
	* Subscribe to an event
	* @param event - Event name to listen for
	* @param callback - Function to call when event is emitted
	* @returns Unsubscribe function
	*/
	on(event, callback) {
		if (!this.listeners.has(event)) this.listeners.set(event, /* @__PURE__ */ new Set());
		this.listeners.get(event).add(callback);
		return () => {
			this.listeners.get(event)?.delete(callback);
		};
	}
	/**
	* Subscribe to an event once (automatically unsubscribes after first emission)
	* @param event - Event name to listen for
	* @param callback - Function to call when event is emitted
	* @returns Unsubscribe function
	*/
	once(event, callback) {
		const unsubscribe = this.on(event, (eventPayload) => {
			callback(eventPayload);
			unsubscribe();
		});
		return unsubscribe;
	}
	/**
	* Unsubscribe from an event
	* @param event - Event name to stop listening for
	* @param callback - Function to remove
	*/
	off(event, callback) {
		this.listeners.get(event)?.delete(callback);
	}
	/**
	* Wait for an event to be emitted
	* @param event - Event name to wait for
	* @param timeout - Optional timeout in milliseconds
	* @returns Promise that resolves with the event payload
	*/
	waitFor(event, timeout) {
		return new Promise((resolve, reject) => {
			let timeoutId;
			const unsubscribe = this.on(event, (eventPayload) => {
				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
				}
				resolve(eventPayload);
				unsubscribe();
			});
			if (timeout) timeoutId = setTimeout(() => {
				timeoutId = void 0;
				unsubscribe();
				reject(/* @__PURE__ */ new Error(`Timeout waiting for event ${String(event)}`));
			}, timeout);
		});
	}
	/**
	* Emit an event to all listeners
	* @param event - Event name to emit
	* @param eventPayload - Event payload
	* @internal For use by subclasses - subclasses should wrap this with a public emit if needed
	*/
	emitInner(event, eventPayload) {
		this.listeners.get(event)?.forEach((listener) => {
			try {
				listener(eventPayload);
			} catch (error) {
				queueMicrotask(() => {
					throw error;
				});
			}
		});
	}
	/**
	* Clear all listeners
	*/
	clearListeners() {
		this.listeners.clear();
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/utils/cursor.js
function buildCursor(orderBy, values) {
	if (values.length === 0 || orderBy.length === 0) return;
	if (orderBy.length === 1) {
		const { expression, compareOptions } = orderBy[0];
		return (compareOptions.direction === `asc` ? gt : lt)(expression, new Value(values[0]));
	}
	const clauses = [];
	for (let i = 0; i < orderBy.length && i < values.length; i++) {
		const clause = orderBy[i];
		const value = values[i];
		const eqConditions = [];
		for (let j = 0; j < i; j++) {
			const prevClause = orderBy[j];
			const prevValue = values[j];
			eqConditions.push(eq(prevClause.expression, new Value(prevValue)));
		}
		const comparison = (clause.compareOptions.direction === `asc` ? gt : lt)(clause.expression, new Value(value));
		if (eqConditions.length === 0) clauses.push(comparison);
		else {
			const allConditions = [...eqConditions, comparison];
			clauses.push(allConditions.reduce((acc, cond) => and(acc, cond)));
		}
	}
	if (clauses.length === 1) return clauses[0];
	return clauses.reduce((acc, clause) => or(acc, clause));
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/subscription.js
var CollectionSubscription = class extends EventEmitter {
	constructor(collection, callback, options) {
		super();
		this.collection = collection;
		this.callback = callback;
		this.options = options;
		this.loadedInitialState = false;
		this.skipFiltering = false;
		this.snapshotSent = false;
		this.loadedSubsets = [];
		this.sentKeys = /* @__PURE__ */ new Set();
		this.limitedSnapshotRowCount = 0;
		this._status = `ready`;
		this.pendingLoadSubsetPromises = /* @__PURE__ */ new Set();
		this.isBufferingForTruncate = false;
		this.truncateBuffer = [];
		this.pendingTruncateRefetches = /* @__PURE__ */ new Set();
		if (options.onUnsubscribe) this.on(`unsubscribed`, (event) => options.onUnsubscribe(event));
		if (options.whereExpression) ensureIndexForExpression(options.whereExpression, this.collection);
		const callbackWithSentKeysTracking = (changes) => {
			callback(changes);
			this.trackSentKeys(changes);
		};
		this.callback = callbackWithSentKeysTracking;
		this.filteredCallback = options.whereExpression ? createFilteredCallback(this.callback, options) : this.callback;
		this.truncateCleanup = this.collection.on(`truncate`, () => {
			this.handleTruncate();
		});
	}
	get status() {
		return this._status;
	}
	/**
	* Handle collection truncate event by resetting state and re-requesting subsets.
	* This is called when the sync layer receives a must-refetch and clears all data.
	*
	* To prevent a flash of missing content, we buffer all changes (deletes from truncate
	* and inserts from refetch) until all loadSubset promises resolve, then emit them together.
	*/
	handleTruncate() {
		const subsetsToReload = [...this.loadedSubsets];
		const hasLoadSubsetHandler = this.collection._sync.syncLoadSubsetFn !== null;
		if (subsetsToReload.length === 0 || !hasLoadSubsetHandler) {
			this.snapshotSent = false;
			this.loadedInitialState = false;
			this.limitedSnapshotRowCount = 0;
			this.lastSentKey = void 0;
			this.loadedSubsets = [];
			return;
		}
		this.isBufferingForTruncate = true;
		this.truncateBuffer = [];
		this.pendingTruncateRefetches.clear();
		this.snapshotSent = false;
		this.loadedInitialState = false;
		this.limitedSnapshotRowCount = 0;
		this.lastSentKey = void 0;
		this.loadedSubsets = [];
		queueMicrotask(() => {
			if (!this.isBufferingForTruncate) return;
			for (const options of subsetsToReload) {
				const syncResult = this.collection._sync.loadSubset(options);
				this.loadedSubsets.push(options);
				this.trackLoadSubsetPromise(syncResult);
				if (syncResult instanceof Promise) {
					this.pendingTruncateRefetches.add(syncResult);
					syncResult.catch(() => {}).finally(() => {
						this.pendingTruncateRefetches.delete(syncResult);
						this.checkTruncateRefetchComplete();
					});
				}
			}
			if (this.pendingTruncateRefetches.size === 0) this.flushTruncateBuffer();
		});
	}
	/**
	* Check if all truncate refetch promises have completed and flush buffer if so
	*/
	checkTruncateRefetchComplete() {
		if (this.pendingTruncateRefetches.size === 0 && this.isBufferingForTruncate) this.flushTruncateBuffer();
	}
	/**
	* Flush the truncate buffer, emitting all buffered changes to the callback
	*/
	flushTruncateBuffer() {
		this.isBufferingForTruncate = false;
		const merged = this.truncateBuffer.flat();
		if (merged.length > 0) this.filteredCallback(merged);
		this.truncateBuffer = [];
	}
	setOrderByIndex(index) {
		this.orderByIndex = index;
	}
	/**
	* Check if an orderBy index has been set for this subscription
	*/
	hasOrderByIndex() {
		return this.orderByIndex !== void 0;
	}
	/**
	* Set subscription status and emit events if changed
	*/
	setStatus(newStatus) {
		if (this._status === newStatus) return;
		const previousStatus = this._status;
		this._status = newStatus;
		this.emitInner(`status:change`, {
			type: `status:change`,
			subscription: this,
			previousStatus,
			status: newStatus
		});
		const eventKey = `status:${newStatus}`;
		this.emitInner(eventKey, {
			type: eventKey,
			subscription: this,
			previousStatus,
			status: newStatus
		});
	}
	/**
	* Track a loadSubset promise and manage loading status
	*/
	trackLoadSubsetPromise(syncResult) {
		if (syncResult instanceof Promise) {
			this.pendingLoadSubsetPromises.add(syncResult);
			this.setStatus(`loadingSubset`);
			syncResult.finally(() => {
				this.pendingLoadSubsetPromises.delete(syncResult);
				if (this.pendingLoadSubsetPromises.size === 0) this.setStatus(`ready`);
			});
		}
	}
	hasLoadedInitialState() {
		return this.loadedInitialState;
	}
	hasSentAtLeastOneSnapshot() {
		return this.snapshotSent;
	}
	emitEvents(changes) {
		const newChanges = this.filterAndFlipChanges(changes);
		if (this.isBufferingForTruncate) {
			if (newChanges.length > 0) this.truncateBuffer.push(newChanges);
		} else this.filteredCallback(newChanges);
	}
	/**
	* Sends the snapshot to the callback.
	* Returns a boolean indicating if it succeeded.
	* It can only fail if there is no index to fulfill the request
	* and the optimizedOnly option is set to true,
	* or, the entire state was already loaded.
	*/
	requestSnapshot(opts) {
		if (this.loadedInitialState) return false;
		const stateOpts = {
			where: this.options.whereExpression,
			optimizedOnly: opts?.optimizedOnly ?? false
		};
		if (opts) {
			if (`where` in opts) {
				const snapshotWhereExp = opts.where;
				if (stateOpts.where) {
					const subWhereExp = stateOpts.where;
					stateOpts.where = and(subWhereExp, snapshotWhereExp);
				} else stateOpts.where = snapshotWhereExp;
			}
		} else this.loadedInitialState = true;
		const loadOptions = {
			where: stateOpts.where,
			subscription: this,
			orderBy: opts?.orderBy,
			limit: opts?.limit
		};
		const syncResult = this.collection._sync.loadSubset(loadOptions);
		opts?.onLoadSubsetResult?.(syncResult);
		this.loadedSubsets.push(loadOptions);
		if (opts?.trackLoadSubsetPromise ?? true) this.trackLoadSubsetPromise(syncResult);
		const snapshot = this.collection.currentStateAsChanges(stateOpts);
		if (snapshot === void 0) return false;
		const filteredSnapshot = snapshot.filter((change) => !this.sentKeys.has(change.key));
		for (const change of filteredSnapshot) this.sentKeys.add(change.key);
		this.snapshotSent = true;
		this.callback(filteredSnapshot);
		return true;
	}
	/**
	* Sends a snapshot that fulfills the `where` clause and all rows are bigger or equal to the cursor.
	* Requires a range index to be set with `setOrderByIndex` prior to calling this method.
	* It uses that range index to load the items in the order of the index.
	*
	* For multi-column orderBy:
	* - Uses first value from `minValues` for LOCAL index operations (wide bounds, ensures no missed rows)
	* - Uses all `minValues` to build a precise composite cursor for SYNC layer loadSubset
	*
	* Note 1: it may load more rows than the provided LIMIT because it loads all values equal to the first cursor value + limit values greater.
	*         This is needed to ensure that it does not accidentally skip duplicate values when the limit falls in the middle of some duplicated values.
	* Note 2: it does not send keys that have already been sent before.
	*/
	requestLimitedSnapshot({ orderBy, limit, minValues, offset, trackLoadSubsetPromise: shouldTrackLoadSubsetPromise = true, onLoadSubsetResult }) {
		if (!limit) throw new Error(`limit is required`);
		if (!this.orderByIndex) throw new Error(`Ordered snapshot was requested but no index was found. You have to call setOrderByIndex before requesting an ordered snapshot.`);
		const hasMinValue = minValues !== void 0 && minValues.length > 0;
		const minValueForIndex = minValues?.[0];
		const index = this.orderByIndex;
		const where = this.options.whereExpression;
		const whereFilterFn = where ? createFilterFunctionFromExpression(where) : void 0;
		const filterFn = (key) => {
			if (key !== void 0 && this.sentKeys.has(key)) return false;
			const value = this.collection.get(key);
			if (value === void 0) return false;
			return whereFilterFn?.(value) ?? true;
		};
		let biggestObservedValue = minValueForIndex;
		const changes = [];
		let keys = [];
		if (hasMinValue) {
			const { expression } = orderBy[0];
			const allRowsWithMinValue = this.collection.currentStateAsChanges({ where: eq(expression, new Value(minValueForIndex)) });
			if (allRowsWithMinValue) {
				const keysWithMinValue = allRowsWithMinValue.map((change) => change.key).filter((key) => !this.sentKeys.has(key) && filterFn(key));
				keys.push(...keysWithMinValue);
				const keysGreaterThanMin = index.take(limit - keys.length, minValueForIndex, filterFn);
				keys.push(...keysGreaterThanMin);
			} else keys = index.take(limit, minValueForIndex, filterFn);
		} else keys = index.takeFromStart(limit, filterFn);
		const valuesNeeded = () => Math.max(limit - changes.length, 0);
		const collectionExhausted = () => keys.length === 0;
		const orderByExpression = orderBy[0].expression;
		const valueExtractor = orderByExpression.type === `ref` ? compileExpression(new PropRef(orderByExpression.path), true) : null;
		while (valuesNeeded() > 0 && !collectionExhausted()) {
			const insertedKeys = /* @__PURE__ */ new Set();
			for (const key of keys) {
				const value = this.collection.get(key);
				changes.push({
					type: `insert`,
					key,
					value
				});
				biggestObservedValue = valueExtractor ? valueExtractor(value) : value;
				insertedKeys.add(key);
			}
			keys = index.take(valuesNeeded(), biggestObservedValue, filterFn);
		}
		const currentOffset = this.limitedSnapshotRowCount;
		for (const change of changes) this.sentKeys.add(change.key);
		this.callback(changes);
		this.limitedSnapshotRowCount += changes.length;
		if (changes.length > 0) this.lastSentKey = changes[changes.length - 1].key;
		let cursorExpressions;
		if (minValues !== void 0 && minValues.length > 0) {
			const whereFromCursor = buildCursor(orderBy, minValues);
			if (whereFromCursor) {
				const { expression } = orderBy[0];
				const cursorMinValue = minValues[0];
				let whereCurrentCursor;
				if (cursorMinValue instanceof Date) {
					const cursorMinValuePlus1ms = new Date(cursorMinValue.getTime() + 1);
					whereCurrentCursor = and(gte(expression, new Value(cursorMinValue)), lt(expression, new Value(cursorMinValuePlus1ms)));
				} else whereCurrentCursor = eq(expression, new Value(cursorMinValue));
				cursorExpressions = {
					whereFrom: whereFromCursor,
					whereCurrent: whereCurrentCursor,
					lastKey: this.lastSentKey
				};
			}
		}
		const loadOptions = {
			where,
			limit,
			orderBy,
			cursor: cursorExpressions,
			offset: offset ?? currentOffset,
			subscription: this
		};
		const syncResult = this.collection._sync.loadSubset(loadOptions);
		onLoadSubsetResult?.(syncResult);
		this.loadedSubsets.push(loadOptions);
		if (shouldTrackLoadSubsetPromise) this.trackLoadSubsetPromise(syncResult);
	}
	/**
	* Filters and flips changes for keys that have not been sent yet.
	* Deletes are filtered out for keys that have not been sent yet.
	* Updates are flipped into inserts for keys that have not been sent yet.
	* Duplicate inserts are filtered out to prevent D2 multiplicity > 1.
	*/
	filterAndFlipChanges(changes) {
		if (this.loadedInitialState || this.skipFiltering) return changes;
		const skipDeleteFilter = this.isBufferingForTruncate;
		const newChanges = [];
		for (const change of changes) {
			let newChange = change;
			if (!this.sentKeys.has(change.key)) {
				if (change.type === `update`) newChange = {
					...change,
					type: `insert`,
					previousValue: void 0
				};
				else if (change.type === `delete`) {
					if (!skipDeleteFilter) continue;
				}
				this.sentKeys.add(change.key);
			} else if (change.type === `insert`) continue;
			else if (change.type === `delete`) this.sentKeys.delete(change.key);
			newChanges.push(newChange);
		}
		return newChanges;
	}
	trackSentKeys(changes) {
		if (this.loadedInitialState || this.skipFiltering) return;
		for (const change of changes) if (change.type === `delete`) this.sentKeys.delete(change.key);
		else this.sentKeys.add(change.key);
		if (this.orderByIndex) this.limitedSnapshotRowCount = Math.max(this.limitedSnapshotRowCount, this.sentKeys.size);
	}
	/**
	* Mark that the subscription should not filter any changes.
	* This is used when includeInitialState is explicitly set to false,
	* meaning the caller doesn't want initial state but does want ALL future changes.
	*/
	markAllStateAsSeen() {
		this.skipFiltering = true;
	}
	unsubscribe() {
		this.truncateCleanup?.();
		this.truncateCleanup = void 0;
		this.isBufferingForTruncate = false;
		this.truncateBuffer = [];
		this.pendingTruncateRefetches.clear();
		for (const options of this.loadedSubsets) this.collection._sync.unloadSubset(options);
		this.loadedSubsets = [];
		this.emitInner(`unsubscribed`, {
			type: `unsubscribed`,
			subscription: this
		});
		this.clearListeners();
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/changes.js
var CollectionChangesManager = class {
	/**
	* Creates a new CollectionChangesManager instance
	*/
	constructor() {
		this.activeSubscribersCount = 0;
		this.changeSubscriptions = /* @__PURE__ */ new Set();
		this.batchedEvents = [];
		this.shouldBatchEvents = false;
	}
	setDeps(deps) {
		this.lifecycle = deps.lifecycle;
		this.sync = deps.sync;
		this.events = deps.events;
		this.collection = deps.collection;
		this.state = deps.state;
	}
	/**
	* Emit an empty ready event to notify subscribers that the collection is ready
	* This bypasses the normal empty array check in emitEvents
	*/
	emitEmptyReadyEvent() {
		for (const subscription of this.changeSubscriptions) subscription.emitEvents([]);
	}
	/**
	* Enriches a change message with virtual properties ($synced, $origin, $key, $collectionId).
	* Uses the "add-if-missing" pattern to preserve virtual properties from upstream collections.
	*/
	enrichChangeWithVirtualProps(change) {
		return this.state.enrichChangeMessage(change);
	}
	/**
	* Emit events either immediately or batch them for later emission
	*/
	emitEvents(changes, forceEmit = false) {
		if (this.shouldBatchEvents && !forceEmit) {
			this.batchedEvents.push(...changes);
			return;
		}
		let rawEvents = changes;
		if (forceEmit) {
			if (this.batchedEvents.length > 0) rawEvents = [...this.batchedEvents, ...changes];
			this.batchedEvents = [];
			this.shouldBatchEvents = false;
		}
		if (rawEvents.length === 0) return;
		const enrichedEvents = rawEvents.map((change) => this.enrichChangeWithVirtualProps(change));
		for (const subscription of this.changeSubscriptions) subscription.emitEvents(enrichedEvents);
	}
	/**
	* Subscribe to changes in the collection
	*/
	subscribeChanges(callback, options = {}) {
		this.addSubscriber();
		if (options.where && options.whereExpression) throw new Error(`Cannot specify both 'where' and 'whereExpression' options. Use one or the other.`);
		const { where, ...opts } = options;
		let whereExpression = opts.whereExpression;
		if (where) whereExpression = toExpression(where(createSingleRowRefProxy()));
		const subscription = new CollectionSubscription(this.collection, callback, {
			...opts,
			whereExpression,
			onUnsubscribe: () => {
				this.removeSubscriber();
				this.changeSubscriptions.delete(subscription);
			}
		});
		if (options.onStatusChange) subscription.on(`status:change`, options.onStatusChange);
		if (options.includeInitialState) subscription.requestSnapshot({
			trackLoadSubsetPromise: false,
			orderBy: options.orderBy,
			limit: options.limit,
			onLoadSubsetResult: options.onLoadSubsetResult
		});
		else if (options.includeInitialState === false) subscription.markAllStateAsSeen();
		this.changeSubscriptions.add(subscription);
		return subscription;
	}
	/**
	* Increment the active subscribers count and start sync if needed
	*/
	addSubscriber() {
		const previousSubscriberCount = this.activeSubscribersCount;
		this.activeSubscribersCount++;
		this.lifecycle.cancelGCTimer();
		if (this.lifecycle.status === `cleaned-up` || this.lifecycle.status === `idle`) this.sync.startSync();
		this.events.emitSubscribersChange(this.activeSubscribersCount, previousSubscriberCount);
	}
	/**
	* Decrement the active subscribers count and start GC timer if needed
	*/
	removeSubscriber() {
		const previousSubscriberCount = this.activeSubscribersCount;
		this.activeSubscribersCount--;
		if (this.activeSubscribersCount === 0) this.lifecycle.startGCTimer();
		else if (this.activeSubscribersCount < 0) throw new NegativeActiveSubscribersError();
		this.events.emitSubscribersChange(this.activeSubscribersCount, previousSubscriberCount);
	}
	/**
	* Clean up the collection by stopping sync and clearing data
	* This can be called manually or automatically by garbage collection
	*/
	cleanup() {
		this.batchedEvents = [];
		this.shouldBatchEvents = false;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/utils/browser-polyfills.js
var requestIdleCallbackPolyfill = (callback) => {
	return setTimeout(() => {
		callback({
			didTimeout: true,
			timeRemaining: () => 50
		});
	}, 0);
};
var cancelIdleCallbackPolyfill = (id) => {
	clearTimeout(id);
};
var safeRequestIdleCallback = typeof window !== `undefined` && `requestIdleCallback` in window ? (callback, options) => window.requestIdleCallback(callback, options) : (callback, _options) => requestIdleCallbackPolyfill(callback);
var safeCancelIdleCallback = typeof window !== `undefined` && `cancelIdleCallback` in window ? (id) => window.cancelIdleCallback(id) : cancelIdleCallbackPolyfill;
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/cleanup-queue.js
var _CleanupQueue = class _CleanupQueue {
	constructor() {
		this.tasks = /* @__PURE__ */ new Map();
		this.timeoutId = null;
		this.microtaskScheduled = false;
	}
	static getInstance() {
		if (!_CleanupQueue.instance) _CleanupQueue.instance = new _CleanupQueue();
		return _CleanupQueue.instance;
	}
	/**
	* Queues a cleanup task and defers timeout selection to a microtask so
	* multiple synchronous registrations can share one root timer.
	*/
	schedule(key, gcTime, callback) {
		const executeAt = Date.now() + gcTime;
		this.tasks.set(key, {
			executeAt,
			callback
		});
		if (!this.microtaskScheduled) {
			this.microtaskScheduled = true;
			Promise.resolve().then(() => {
				this.microtaskScheduled = false;
				this.updateTimeout();
			});
		}
	}
	cancel(key) {
		this.tasks.delete(key);
	}
	/**
	* Keeps only one active timeout: whichever task is due next.
	*/
	updateTimeout() {
		if (this.timeoutId !== null) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
		if (this.tasks.size === 0) return;
		let earliestTime = Infinity;
		for (const task of this.tasks.values()) if (task.executeAt < earliestTime) earliestTime = task.executeAt;
		const delay = Math.max(0, earliestTime - Date.now());
		this.timeoutId = setTimeout(() => this.process(), delay);
	}
	/**
	* Runs every task whose deadline has passed, then schedules the next wakeup
	* if there is still pending work.
	*/
	process() {
		this.timeoutId = null;
		const now = Date.now();
		for (const [key, task] of this.tasks.entries()) if (now >= task.executeAt) {
			this.tasks.delete(key);
			try {
				task.callback();
			} catch (error) {
				console.error("Error in CleanupQueue task:", error);
			}
		}
		if (this.tasks.size > 0) this.updateTimeout();
	}
	/**
	* Resets the singleton instance for tests.
	*/
	static resetInstance() {
		if (_CleanupQueue.instance) {
			if (_CleanupQueue.instance.timeoutId !== null) clearTimeout(_CleanupQueue.instance.timeoutId);
			_CleanupQueue.instance = null;
		}
	}
};
_CleanupQueue.instance = null;
var CleanupQueue = _CleanupQueue;
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/lifecycle.js
var CollectionLifecycleManager = class {
	/**
	* Creates a new CollectionLifecycleManager instance
	*/
	constructor(config, id) {
		this.status = `idle`;
		this.hasBeenReady = false;
		this.hasReceivedFirstCommit = false;
		this.onFirstReadyCallbacks = [];
		this.idleCallbackId = null;
		this.config = config;
		this.id = id;
	}
	setDeps(deps) {
		this.indexes = deps.indexes;
		this.events = deps.events;
		this.changes = deps.changes;
		this.sync = deps.sync;
		this.state = deps.state;
	}
	/**
	* Validates state transitions to prevent invalid status changes
	*/
	validateStatusTransition(from, to) {
		if (from === to) return;
		if (!{
			idle: [
				`loading`,
				`error`,
				`cleaned-up`
			],
			loading: [
				`ready`,
				`error`,
				`cleaned-up`
			],
			ready: [`cleaned-up`, `error`],
			error: [`cleaned-up`, `idle`],
			"cleaned-up": [`loading`, `error`]
		}[from].includes(to)) throw new InvalidCollectionStatusTransitionError(from, to, this.id);
	}
	/**
	* Safely update the collection status with validation
	* @private
	*/
	setStatus(newStatus, allowReady = false) {
		if (newStatus === `ready` && !allowReady) throw new CollectionStateError(`You can't directly call "setStatus('ready'). You must use markReady instead.`);
		this.validateStatusTransition(this.status, newStatus);
		const previousStatus = this.status;
		this.status = newStatus;
		this.events.emitStatusChange(newStatus, previousStatus);
	}
	/**
	* Validates that the collection is in a usable state for data operations
	* @private
	*/
	validateCollectionUsable(operation) {
		switch (this.status) {
			case `error`: throw new CollectionInErrorStateError(operation, this.id);
			case `cleaned-up`:
				this.sync.startSync();
				break;
		}
	}
	/**
	* Mark the collection as ready for use
	* This is called by sync implementations to explicitly signal that the collection is ready,
	* providing a more intuitive alternative to using commits for readiness signaling
	* @private - Should only be called by sync implementations
	*/
	markReady() {
		this.validateStatusTransition(this.status, `ready`);
		if (this.status === `loading`) {
			this.setStatus(`ready`, true);
			if (!this.hasBeenReady) {
				this.hasBeenReady = true;
				if (!this.hasReceivedFirstCommit) this.hasReceivedFirstCommit = true;
				const callbacks = [...this.onFirstReadyCallbacks];
				this.onFirstReadyCallbacks = [];
				callbacks.forEach((callback) => callback());
			}
			if (this.changes.changeSubscriptions.size > 0) this.changes.emitEmptyReadyEvent();
		}
	}
	/**
	* Start the garbage collection timer
	* Called when the collection becomes inactive (no subscribers)
	*/
	startGCTimer() {
		const gcTime = this.config.gcTime ?? 3e5;
		if (gcTime <= 0 || !Number.isFinite(gcTime)) return;
		CleanupQueue.getInstance().schedule(this, gcTime, () => {
			if (this.changes.activeSubscribersCount === 0) this.scheduleIdleCleanup();
		});
	}
	/**
	* Cancel the garbage collection timer
	* Called when the collection becomes active again
	*/
	cancelGCTimer() {
		CleanupQueue.getInstance().cancel(this);
		if (this.idleCallbackId !== null) {
			safeCancelIdleCallback(this.idleCallbackId);
			this.idleCallbackId = null;
		}
	}
	/**
	* Schedule cleanup to run during browser idle time
	* This prevents blocking the UI thread during cleanup operations
	*/
	scheduleIdleCleanup() {
		if (this.idleCallbackId !== null) safeCancelIdleCallback(this.idleCallbackId);
		this.idleCallbackId = safeRequestIdleCallback((deadline) => {
			if (this.changes.activeSubscribersCount === 0) {
				if (this.performCleanup(deadline)) this.idleCallbackId = null;
			} else this.idleCallbackId = null;
		}, { timeout: 1e3 });
	}
	/**
	* Perform cleanup operations, optionally in chunks during idle time
	* @returns true if cleanup was completed, false if it was rescheduled
	*/
	performCleanup(deadline) {
		if (!deadline || deadline.timeRemaining() > 0 || deadline.didTimeout) {
			this.sync.cleanup();
			this.state.cleanup();
			this.changes.cleanup();
			this.indexes.cleanup();
			CleanupQueue.getInstance().cancel(this);
			this.hasBeenReady = false;
			const callbacks = [...this.onFirstReadyCallbacks];
			this.onFirstReadyCallbacks = [];
			callbacks.forEach((callback) => {
				try {
					callback();
				} catch (error) {
					console.error(`${this.config.id ? `[${this.config.id}] ` : ``}Error in onFirstReady callback during cleanup:`, error);
				}
			});
			this.setStatus(`cleaned-up`);
			this.events.cleanup();
			return true;
		} else {
			this.scheduleIdleCleanup();
			return false;
		}
	}
	/**
	* Register a callback to be executed when the collection first becomes ready
	* Useful for preloading collections
	* @param callback Function to call when the collection first becomes ready
	*/
	onFirstReady(callback) {
		if (this.hasBeenReady) {
			callback();
			return;
		}
		this.onFirstReadyCallbacks.push(callback);
	}
	cleanup() {
		if (this.idleCallbackId !== null) {
			safeCancelIdleCallback(this.idleCallbackId);
			this.idleCallbackId = null;
		}
		this.performCleanup();
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/live/internal.js
var LIVE_QUERY_INTERNAL = /* @__PURE__ */ Symbol(`liveQueryInternal`);
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/sync.js
var CollectionSyncManager = class {
	/**
	* Creates a new CollectionSyncManager instance
	*/
	constructor(config, id) {
		this.preloadPromise = null;
		this.syncCleanupFn = null;
		this.syncLoadSubsetFn = null;
		this.syncUnloadSubsetFn = null;
		this.pendingLoadSubsetPromises = /* @__PURE__ */ new Set();
		this.config = config;
		this.id = id;
		this.syncMode = config.syncMode ?? `eager`;
	}
	setDeps(deps) {
		this.collection = deps.collection;
		this.state = deps.state;
		this.lifecycle = deps.lifecycle;
		this._events = deps.events;
	}
	/**
	* Start the sync process for this collection
	* This is called when the collection is first accessed or preloaded
	*/
	startSync() {
		if (this.lifecycle.status !== `idle` && this.lifecycle.status !== `cleaned-up`) return;
		this.lifecycle.setStatus(`loading`);
		try {
			const syncRes = normalizeSyncFnResult(this.config.sync.sync({
				collection: this.collection,
				begin: (options) => {
					this.state.pendingSyncedTransactions.push({
						committed: false,
						operations: [],
						deletedKeys: /* @__PURE__ */ new Set(),
						rowMetadataWrites: /* @__PURE__ */ new Map(),
						collectionMetadataWrites: /* @__PURE__ */ new Map(),
						immediate: options?.immediate
					});
				},
				write: (messageWithOptionalKey) => {
					const pendingTransaction = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
					if (!pendingTransaction) throw new NoPendingSyncTransactionWriteError();
					if (pendingTransaction.committed) throw new SyncTransactionAlreadyCommittedWriteError();
					let key = void 0;
					if (`key` in messageWithOptionalKey) key = messageWithOptionalKey.key;
					else key = this.config.getKey(messageWithOptionalKey.value);
					if (this.state.pendingLocalChanges.has(key)) this.state.pendingLocalOrigins.add(key);
					let messageType = messageWithOptionalKey.type;
					if (messageWithOptionalKey.type === `insert`) {
						const insertingIntoExistingSynced = this.state.syncedData.has(key);
						const hasPendingDeleteForKey = pendingTransaction.deletedKeys.has(key);
						const isTruncateTransaction = pendingTransaction.truncate === true;
						if (insertingIntoExistingSynced && !hasPendingDeleteForKey && !isTruncateTransaction) {
							const existingValue = this.state.syncedData.get(key);
							if (existingValue !== void 0 && deepEquals(existingValue, messageWithOptionalKey.value)) messageType = `update`;
							else {
								const internal = this.config.utils[LIVE_QUERY_INTERNAL];
								throw new DuplicateKeySyncError(key, this.id, {
									hasCustomGetKey: internal?.hasCustomGetKey ?? false,
									hasJoins: internal?.hasJoins ?? false,
									hasDistinct: internal?.hasDistinct ?? false
								});
							}
						}
					}
					const message = {
						...messageWithOptionalKey,
						type: messageType,
						key
					};
					pendingTransaction.operations.push(message);
					if (messageType === `delete`) {
						pendingTransaction.deletedKeys.add(key);
						pendingTransaction.rowMetadataWrites.set(key, { type: `delete` });
					} else if (messageType === `insert`) if (message.metadata !== void 0) pendingTransaction.rowMetadataWrites.set(key, {
						type: `set`,
						value: message.metadata
					});
					else pendingTransaction.rowMetadataWrites.set(key, { type: `delete` });
					else if (message.metadata !== void 0) pendingTransaction.rowMetadataWrites.set(key, {
						type: `set`,
						value: message.metadata
					});
				},
				commit: () => {
					const pendingTransaction = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
					if (!pendingTransaction) throw new NoPendingSyncTransactionCommitError();
					if (pendingTransaction.committed) throw new SyncTransactionAlreadyCommittedError();
					pendingTransaction.committed = true;
					this.state.commitPendingTransactions();
				},
				markReady: () => {
					this.lifecycle.markReady();
				},
				truncate: () => {
					const pendingTransaction = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
					if (!pendingTransaction) throw new NoPendingSyncTransactionWriteError();
					if (pendingTransaction.committed) throw new SyncTransactionAlreadyCommittedWriteError();
					pendingTransaction.operations = [];
					pendingTransaction.deletedKeys.clear();
					pendingTransaction.rowMetadataWrites.clear();
					pendingTransaction.truncate = true;
					pendingTransaction.optimisticSnapshot = {
						upserts: new Map(this.state.optimisticUpserts),
						deletes: new Set(this.state.optimisticDeletes)
					};
				},
				metadata: this.createSyncMetadataApi()
			}));
			this.syncCleanupFn = syncRes?.cleanup ?? null;
			this.syncLoadSubsetFn = syncRes?.loadSubset ?? null;
			this.syncUnloadSubsetFn = syncRes?.unloadSubset ?? null;
			if (this.syncMode === `on-demand` && !this.syncLoadSubsetFn) throw new CollectionConfigurationError(`Collection "${this.id}" is configured with syncMode "on-demand" but the sync function did not return a loadSubset handler. Either provide a loadSubset handler or use syncMode "eager".`);
		} catch (error) {
			this.lifecycle.setStatus(`error`);
			throw error;
		}
	}
	getActivePendingSyncTransaction() {
		const pendingTransaction = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
		if (!pendingTransaction) throw new NoPendingSyncTransactionWriteError();
		if (pendingTransaction.committed) throw new SyncTransactionAlreadyCommittedWriteError();
		return pendingTransaction;
	}
	createSyncMetadataApi() {
		return {
			row: {
				get: (key) => {
					const pendingTransaction = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
					const pendingWrite = pendingTransaction?.rowMetadataWrites.get(key);
					if (pendingWrite) return pendingWrite.type === `delete` ? void 0 : pendingWrite.value;
					if (pendingTransaction?.truncate) return;
					return this.state.syncedMetadata.get(key);
				},
				set: (key, metadata) => {
					this.getActivePendingSyncTransaction().rowMetadataWrites.set(key, {
						type: `set`,
						value: metadata
					});
				},
				delete: (key) => {
					this.getActivePendingSyncTransaction().rowMetadataWrites.set(key, { type: `delete` });
				}
			},
			collection: {
				get: (key) => {
					const pendingWrite = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1]?.collectionMetadataWrites.get(key);
					if (pendingWrite) return pendingWrite.type === `delete` ? void 0 : pendingWrite.value;
					return this.state.syncedCollectionMetadata.get(key);
				},
				set: (key, value) => {
					this.getActivePendingSyncTransaction().collectionMetadataWrites.set(key, {
						type: `set`,
						value
					});
				},
				delete: (key) => {
					this.getActivePendingSyncTransaction().collectionMetadataWrites.set(key, { type: `delete` });
				},
				list: (prefix) => {
					const merged = new Map(this.state.syncedCollectionMetadata);
					const pendingTransaction = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
					if (pendingTransaction) for (const [key, pendingWrite] of pendingTransaction.collectionMetadataWrites) if (pendingWrite.type === `delete`) merged.delete(key);
					else merged.set(key, pendingWrite.value);
					return Array.from(merged.entries()).filter(([key]) => prefix ? key.startsWith(prefix) : true).map(([key, value]) => ({
						key,
						value
					}));
				}
			}
		};
	}
	/**
	* Preload the collection data by starting sync if not already started
	* Multiple concurrent calls will share the same promise
	*/
	preload() {
		if (this.preloadPromise) return this.preloadPromise;
		if (this.syncMode === `on-demand`) console.warn(`${this.id ? `[${this.id}] ` : ``}Calling .preload() on a collection with syncMode "on-demand" is a no-op. In on-demand mode, data is only loaded when queries request it. Instead, create a live query and call .preload() on that to load the specific data you need. See https://tanstack.com/blog/tanstack-db-0.5-query-driven-sync for more details.`);
		this.preloadPromise = new Promise((resolve, reject) => {
			if (this.lifecycle.status === `ready`) {
				resolve();
				return;
			}
			if (this.lifecycle.status === `error`) {
				reject(new CollectionIsInErrorStateError());
				return;
			}
			this.lifecycle.onFirstReady(() => {
				resolve();
			});
			if (this.lifecycle.status === `idle` || this.lifecycle.status === `cleaned-up`) try {
				this.startSync();
			} catch (error) {
				reject(error);
				return;
			}
		});
		return this.preloadPromise;
	}
	/**
	* Gets whether the collection is currently loading more data
	*/
	get isLoadingSubset() {
		return this.pendingLoadSubsetPromises.size > 0;
	}
	/**
	* Tracks a load promise for isLoadingSubset state.
	* @internal This is for internal coordination (e.g., live-query glue code), not for general use.
	*/
	trackLoadPromise(promise) {
		const loadingStarting = !this.isLoadingSubset;
		this.pendingLoadSubsetPromises.add(promise);
		if (loadingStarting) this._events.emit(`loadingSubset:change`, {
			type: `loadingSubset:change`,
			collection: this.collection,
			isLoadingSubset: true,
			previousIsLoadingSubset: false,
			loadingSubsetTransition: `start`
		});
		promise.finally(() => {
			const loadingEnding = this.pendingLoadSubsetPromises.size === 1 && this.pendingLoadSubsetPromises.has(promise);
			this.pendingLoadSubsetPromises.delete(promise);
			if (loadingEnding) this._events.emit(`loadingSubset:change`, {
				type: `loadingSubset:change`,
				collection: this.collection,
				isLoadingSubset: false,
				previousIsLoadingSubset: true,
				loadingSubsetTransition: `end`
			});
		});
	}
	/**
	* Requests the sync layer to load more data.
	* @param options Options to control what data is being loaded
	* @returns If data loading is asynchronous, this method returns a promise that resolves when the data is loaded.
	*          Returns true if no sync function is configured, if syncMode is 'eager', or if there is no work to do.
	*/
	loadSubset(options) {
		if (this.syncMode === `eager`) return true;
		if (this.syncLoadSubsetFn) {
			const result = this.syncLoadSubsetFn(options);
			if (result instanceof Promise) {
				this.trackLoadPromise(result);
				return result;
			}
		}
		return true;
	}
	/**
	* Notifies the sync layer that a subset is no longer needed.
	* @param options Options that identify what data is being unloaded
	*/
	unloadSubset(options) {
		if (this.syncUnloadSubsetFn) this.syncUnloadSubsetFn(options);
	}
	cleanup() {
		try {
			if (this.syncCleanupFn) {
				this.syncCleanupFn();
				this.syncCleanupFn = null;
			}
		} catch (error) {
			queueMicrotask(() => {
				if (error instanceof Error) {
					const wrappedError = new SyncCleanupError(this.id, error);
					wrappedError.cause = error;
					wrappedError.stack = error.stack;
					throw wrappedError;
				} else throw new SyncCleanupError(this.id, error);
			});
		}
		this.preloadPromise = null;
	}
};
function normalizeSyncFnResult(result) {
	if (typeof result === `function`) return { cleanup: result };
	if (typeof result === `object`) return result;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/indexes.js
var INDEX_SIGNATURE_VERSION = 1;
function compareStringsCodePoint(left, right) {
	if (left === right) return 0;
	return left < right ? -1 : 1;
}
function resolveResolverMetadata(resolver) {
	return {
		kind: `constructor`,
		...resolver.name ? { name: resolver.name } : {}
	};
}
function toSerializableIndexValue(value) {
	if (value == null) return value;
	switch (typeof value) {
		case `string`:
		case `boolean`: return value;
		case `number`: return Number.isFinite(value) ? value : null;
		case `bigint`: return {
			__type: `bigint`,
			value: value.toString()
		};
		case `function`:
		case `symbol`: return;
		case `undefined`: return;
	}
	if (Array.isArray(value)) return value.map((entry) => toSerializableIndexValue(entry) ?? null);
	if (value instanceof Date) return {
		__type: `date`,
		value: value.toISOString()
	};
	if (value instanceof Set) return {
		__type: `set`,
		values: Array.from(value).map((entry) => toSerializableIndexValue(entry) ?? null).sort((a, b) => compareStringsCodePoint(stableStringifyCollectionIndexValue(a), stableStringifyCollectionIndexValue(b)))
	};
	if (value instanceof Map) return {
		__type: `map`,
		entries: Array.from(value.entries()).map(([mapKey, mapValue]) => ({
			key: toSerializableIndexValue(mapKey) ?? null,
			value: toSerializableIndexValue(mapValue) ?? null
		})).sort((a, b) => compareStringsCodePoint(stableStringifyCollectionIndexValue(a.key), stableStringifyCollectionIndexValue(b.key)))
	};
	if (value instanceof RegExp) return {
		__type: `regexp`,
		value: value.toString()
	};
	const serializedObject = {};
	const entries = Object.entries(value).sort(([leftKey], [rightKey]) => compareStringsCodePoint(leftKey, rightKey));
	for (const [key, entryValue] of entries) {
		const serializedEntry = toSerializableIndexValue(entryValue);
		if (serializedEntry !== void 0) serializedObject[key] = serializedEntry;
	}
	return serializedObject;
}
function stableStringifyCollectionIndexValue(value) {
	if (value === null) return `null`;
	if (Array.isArray(value)) return `[${value.map(stableStringifyCollectionIndexValue).join(`,`)}]`;
	if (typeof value !== `object`) return JSON.stringify(value);
	return `{${Object.keys(value).sort((left, right) => compareStringsCodePoint(left, right)).map((key) => `${JSON.stringify(key)}:${stableStringifyCollectionIndexValue(value[key])}`).join(`,`)}}`;
}
function createCollectionIndexMetadata(indexId, expression, name, resolver, options) {
	const resolverMetadata = resolveResolverMetadata(resolver);
	const serializedExpression = toSerializableIndexValue(expression) ?? null;
	const serializedOptions = toSerializableIndexValue(options);
	return {
		signatureVersion: INDEX_SIGNATURE_VERSION,
		signature: stableStringifyCollectionIndexValue(toSerializableIndexValue({
			signatureVersion: INDEX_SIGNATURE_VERSION,
			expression: serializedExpression,
			options: serializedOptions ?? null
		}) ?? null),
		indexId,
		name,
		expression,
		resolver: resolverMetadata,
		...serializedOptions === void 0 ? {} : { options: serializedOptions }
	};
}
function cloneSerializableIndexValue(value) {
	if (value === null || typeof value !== `object`) return value;
	if (Array.isArray(value)) return value.map((entry) => cloneSerializableIndexValue(entry));
	const cloned = {};
	for (const [key, entryValue] of Object.entries(value)) cloned[key] = cloneSerializableIndexValue(entryValue);
	return cloned;
}
function cloneExpression(expression) {
	return JSON.parse(JSON.stringify(expression));
}
var CollectionIndexesManager = class {
	constructor() {
		this.indexes = /* @__PURE__ */ new Map();
		this.indexMetadata = /* @__PURE__ */ new Map();
		this.indexCounter = 0;
	}
	setDeps(deps) {
		this.state = deps.state;
		this.lifecycle = deps.lifecycle;
		this.defaultIndexType = deps.defaultIndexType;
		this.events = deps.events;
	}
	/**
	* Creates an index on a collection for faster queries.
	*
	* @example
	* ```ts
	* // With explicit index type (recommended for tree-shaking)
	* import { BasicIndex } from '@tanstack/db'
	* collection.createIndex((row) => row.userId, { indexType: BasicIndex })
	*
	* // With collection's default index type
	* collection.createIndex((row) => row.userId)
	* ```
	*/
	createIndex(indexCallback, config = {}) {
		this.lifecycle.validateCollectionUsable(`createIndex`);
		const indexId = ++this.indexCounter;
		const expression = toExpression(indexCallback(createSingleRowRefProxy()));
		const IndexType = config.indexType ?? this.defaultIndexType;
		if (!IndexType) throw new CollectionConfigurationError(`No index type specified and no defaultIndexType set on collection. Either pass indexType in config, or set defaultIndexType on the collection:
  import { BasicIndex } from '@tanstack/db'
  createCollection({ defaultIndexType: BasicIndex, ... })`);
		const index = new IndexType(indexId, expression, config.name, config.options);
		index.build(this.state.entries());
		this.indexes.set(indexId, index);
		const metadata = createCollectionIndexMetadata(indexId, expression, config.name, IndexType, config.options);
		this.indexMetadata.set(indexId, metadata);
		this.events.emitIndexAdded(metadata);
		return index;
	}
	/**
	* Removes an index from this collection.
	* Returns true when an index existed and was removed, false otherwise.
	*/
	removeIndex(indexOrId) {
		this.lifecycle.validateCollectionUsable(`removeIndex`);
		const indexId = typeof indexOrId === `number` ? indexOrId : indexOrId.id;
		const index = this.indexes.get(indexId);
		if (!index) return false;
		if (typeof indexOrId !== `number` && index !== indexOrId) return false;
		this.indexes.delete(indexId);
		const metadata = this.indexMetadata.get(indexId);
		this.indexMetadata.delete(indexId);
		if (metadata) this.events.emitIndexRemoved(metadata);
		return true;
	}
	/**
	* Returns a sorted snapshot of index metadata.
	* This allows persisted wrappers to bootstrap from indexes that were created
	* before they attached lifecycle listeners.
	*/
	getIndexMetadataSnapshot() {
		return Array.from(this.indexMetadata.values()).sort((left, right) => left.indexId - right.indexId).map((metadata) => ({
			...metadata,
			expression: cloneExpression(metadata.expression),
			resolver: { ...metadata.resolver },
			...metadata.options === void 0 ? {} : { options: cloneSerializableIndexValue(metadata.options) }
		}));
	}
	/**
	* Updates all indexes when the collection changes
	*/
	updateIndexes(changes) {
		for (const index of this.indexes.values()) for (const change of changes) switch (change.type) {
			case `insert`:
				index.add(change.key, change.value);
				break;
			case `update`:
				if (change.previousValue) index.update(change.key, change.previousValue, change.value);
				else index.add(change.key, change.value);
				break;
			case `delete`:
				index.remove(change.key, change.value);
				break;
		}
	}
	/**
	* Clean up indexes
	*/
	cleanup() {
		this.indexes.clear();
		this.indexMetadata.clear();
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/proxy.js
var CALLBACK_ITERATION_METHODS = /* @__PURE__ */ new Set([
	`find`,
	`findLast`,
	`findIndex`,
	`findLastIndex`,
	`filter`,
	`map`,
	`flatMap`,
	`forEach`,
	`some`,
	`every`,
	`reduce`,
	`reduceRight`
]);
var ARRAY_MODIFYING_METHODS = /* @__PURE__ */ new Set([
	`pop`,
	`push`,
	`shift`,
	`unshift`,
	`splice`,
	`sort`,
	`reverse`,
	`fill`,
	`copyWithin`
]);
var MAP_SET_MODIFYING_METHODS = /* @__PURE__ */ new Set([
	`set`,
	`delete`,
	`clear`,
	`add`
]);
var MAP_SET_ITERATOR_METHODS = /* @__PURE__ */ new Set([
	`entries`,
	`keys`,
	`values`,
	`forEach`
]);
function isProxiableObject(value) {
	return value !== null && typeof value === `object` && !(value instanceof Date) && !(value instanceof RegExp) && !isTemporal$1(value);
}
function createArrayIterationHandler(methodName, methodFn, changeTracker, memoizedCreateChangeProxy) {
	if (!CALLBACK_ITERATION_METHODS.has(methodName)) return;
	return function(...args) {
		const callback = args[0];
		if (typeof callback !== `function`) return methodFn.apply(changeTracker.copy_, args);
		const getProxiedElement = (element, index) => {
			if (isProxiableObject(element)) {
				const { proxy: elementProxy } = memoizedCreateChangeProxy(element, {
					tracker: changeTracker,
					prop: String(index)
				});
				return elementProxy;
			}
			return element;
		};
		const wrappedCallback = function(element, index, array) {
			const proxiedElement = getProxiedElement(element, index);
			return callback.call(this, proxiedElement, index, array);
		};
		if (methodName === `reduce` || methodName === `reduceRight`) {
			const reduceCallback = function(accumulator, element, index, array) {
				const proxiedElement = getProxiedElement(element, index);
				return callback.call(this, accumulator, proxiedElement, index, array);
			};
			return methodFn.apply(changeTracker.copy_, [reduceCallback, ...args.slice(1)]);
		}
		const result = methodFn.apply(changeTracker.copy_, [wrappedCallback, ...args.slice(1)]);
		if ((methodName === `find` || methodName === `findLast`) && result && typeof result === `object`) {
			const foundIndex = changeTracker.copy_.indexOf(result);
			if (foundIndex !== -1) return getProxiedElement(result, foundIndex);
		}
		if (methodName === `filter` && Array.isArray(result)) return result.map((element) => {
			const originalIndex = changeTracker.copy_.indexOf(element);
			if (originalIndex !== -1) return getProxiedElement(element, originalIndex);
			return element;
		});
		return result;
	};
}
function createArrayIteratorHandler(changeTracker, memoizedCreateChangeProxy) {
	return function() {
		const array = changeTracker.copy_;
		let index = 0;
		return {
			next() {
				if (index >= array.length) return {
					done: true,
					value: void 0
				};
				const element = array[index];
				let proxiedElement = element;
				if (isProxiableObject(element)) {
					const { proxy: elementProxy } = memoizedCreateChangeProxy(element, {
						tracker: changeTracker,
						prop: String(index)
					});
					proxiedElement = elementProxy;
				}
				index++;
				return {
					done: false,
					value: proxiedElement
				};
			},
			[Symbol.iterator]() {
				return this;
			}
		};
	};
}
function createModifyingMethodHandler(methodFn, changeTracker, markChanged) {
	return function(...args) {
		const result = methodFn.apply(changeTracker.copy_, args);
		markChanged(changeTracker);
		return result;
	};
}
function createMapSetIteratorHandler(methodName, prop, methodFn, target, changeTracker, memoizedCreateChangeProxy, markChanged) {
	if (!(MAP_SET_ITERATOR_METHODS.has(methodName) || prop === Symbol.iterator)) return;
	return function(...args) {
		const result = methodFn.apply(changeTracker.copy_, args);
		if (methodName === `forEach`) {
			const callback = args[0];
			if (typeof callback === `function`) {
				const wrappedCallback = function(value, key, collection) {
					const cbresult = callback.call(this, value, key, collection);
					markChanged(changeTracker);
					return cbresult;
				};
				return methodFn.apply(target, [wrappedCallback, ...args.slice(1)]);
			}
		}
		if (methodName === `entries` || methodName === `values` || methodName === Symbol.iterator.toString() || prop === Symbol.iterator) {
			const originalIterator = result;
			const valueToKeyMap = /* @__PURE__ */ new Map();
			if (methodName === `values` && target instanceof Map) for (const [key, mapValue] of changeTracker.copy_.entries()) valueToKeyMap.set(mapValue, key);
			const originalToModifiedMap = /* @__PURE__ */ new Map();
			if (target instanceof Set) for (const setValue of changeTracker.copy_.values()) originalToModifiedMap.set(setValue, setValue);
			return {
				next() {
					const nextResult = originalIterator.next();
					if (!nextResult.done && nextResult.value && typeof nextResult.value === `object`) {
						if (methodName === `entries` && Array.isArray(nextResult.value) && nextResult.value.length === 2) {
							if (nextResult.value[1] && typeof nextResult.value[1] === `object`) {
								const mapKey = nextResult.value[0];
								const mapParent = {
									tracker: changeTracker,
									prop: mapKey,
									updateMap: (newValue) => {
										if (changeTracker.copy_ instanceof Map) changeTracker.copy_.set(mapKey, newValue);
									}
								};
								const { proxy: valueProxy } = memoizedCreateChangeProxy(nextResult.value[1], mapParent);
								nextResult.value[1] = valueProxy;
							}
						} else if (methodName === `values` || methodName === Symbol.iterator.toString() || prop === Symbol.iterator) if (methodName === `values` && target instanceof Map) {
							const mapKey = valueToKeyMap.get(nextResult.value);
							if (mapKey !== void 0) {
								const mapParent = {
									tracker: changeTracker,
									prop: mapKey,
									updateMap: (newValue) => {
										if (changeTracker.copy_ instanceof Map) changeTracker.copy_.set(mapKey, newValue);
									}
								};
								const { proxy: valueProxy } = memoizedCreateChangeProxy(nextResult.value, mapParent);
								nextResult.value = valueProxy;
							}
						} else if (target instanceof Set) {
							const setOriginalValue = nextResult.value;
							const setParent = {
								tracker: changeTracker,
								prop: setOriginalValue,
								updateSet: (newValue) => {
									if (changeTracker.copy_ instanceof Set) {
										changeTracker.copy_.delete(setOriginalValue);
										changeTracker.copy_.add(newValue);
										originalToModifiedMap.set(setOriginalValue, newValue);
									}
								}
							};
							const { proxy: valueProxy } = memoizedCreateChangeProxy(nextResult.value, setParent);
							nextResult.value = valueProxy;
						} else {
							const tempKey = /* @__PURE__ */ Symbol(`iterator-value`);
							const { proxy: valueProxy } = memoizedCreateChangeProxy(nextResult.value, {
								tracker: changeTracker,
								prop: tempKey
							});
							nextResult.value = valueProxy;
						}
					}
					return nextResult;
				},
				[Symbol.iterator]() {
					return this;
				}
			};
		}
		return result;
	};
}
function debugLog(...args) {
	const isBrowser = typeof window !== `undefined` && typeof localStorage !== `undefined`;
	if (isBrowser && localStorage.getItem(`DEBUG`) === `true`) console.log(`[proxy]`, ...args);
	else if (!isBrowser && typeof process !== `undefined` && process.env.DEBUG === `true`) console.log(`[proxy]`, ...args);
}
function deepClone(obj, visited = /* @__PURE__ */ new WeakMap()) {
	if (obj === null || obj === void 0) return obj;
	if (typeof obj !== `object`) return obj;
	if (visited.has(obj)) return visited.get(obj);
	if (obj instanceof Date) return new Date(obj.getTime());
	if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
	if (Array.isArray(obj)) {
		const arrayClone = [];
		visited.set(obj, arrayClone);
		obj.forEach((item, index) => {
			arrayClone[index] = deepClone(item, visited);
		});
		return arrayClone;
	}
	if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {
		const TypedArrayConstructor = Object.getPrototypeOf(obj).constructor;
		const clone2 = new TypedArrayConstructor(obj.length);
		visited.set(obj, clone2);
		for (let i = 0; i < obj.length; i++) clone2[i] = obj[i];
		return clone2;
	}
	if (obj instanceof Map) {
		const clone2 = /* @__PURE__ */ new Map();
		visited.set(obj, clone2);
		obj.forEach((value, key) => {
			clone2.set(key, deepClone(value, visited));
		});
		return clone2;
	}
	if (obj instanceof Set) {
		const clone2 = /* @__PURE__ */ new Set();
		visited.set(obj, clone2);
		obj.forEach((value) => {
			clone2.add(deepClone(value, visited));
		});
		return clone2;
	}
	if (isTemporal$1(obj)) return obj;
	const clone = {};
	visited.set(obj, clone);
	for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) clone[key] = deepClone(obj[key], visited);
	const symbolProps = Object.getOwnPropertySymbols(obj);
	for (const sym of symbolProps) clone[sym] = deepClone(obj[sym], visited);
	return clone;
}
var count = 0;
function getProxyCount() {
	count += 1;
	return count;
}
function createChangeProxy(target, parent) {
	const changeProxyCache = /* @__PURE__ */ new Map();
	function memoizedCreateChangeProxy(innerTarget, innerParent) {
		debugLog(`Object ID:`, innerTarget.constructor.name);
		if (changeProxyCache.has(innerTarget)) return changeProxyCache.get(innerTarget);
		else {
			const changeProxy = createChangeProxy(innerTarget, innerParent);
			changeProxyCache.set(innerTarget, changeProxy);
			return changeProxy;
		}
	}
	const proxyCache = /* @__PURE__ */ new Map();
	const changeTracker = {
		copy_: deepClone(target),
		originalObject: deepClone(target),
		proxyCount: getProxyCount(),
		modified: false,
		assigned_: {},
		parent,
		target
	};
	debugLog(`createChangeProxy called for target`, target, changeTracker.proxyCount);
	function markChanged(state) {
		if (!state.modified) state.modified = true;
		if (state.parent) {
			debugLog(`propagating change to parent`);
			if (`updateMap` in state.parent) state.parent.updateMap(state.copy_);
			else if (`updateSet` in state.parent) state.parent.updateSet(state.copy_);
			else {
				state.parent.tracker.copy_[state.parent.prop] = state.copy_;
				state.parent.tracker.assigned_[state.parent.prop] = true;
			}
			markChanged(state.parent.tracker);
		}
	}
	function checkIfReverted(state) {
		debugLog(`checkIfReverted called with assigned keys:`, Object.keys(state.assigned_));
		if (Object.keys(state.assigned_).length === 0 && Object.getOwnPropertySymbols(state.assigned_).length === 0) {
			debugLog(`No assigned properties, returning true`);
			return true;
		}
		for (const prop in state.assigned_) if (state.assigned_[prop] === true) {
			const currentValue = state.copy_[prop];
			const originalValue = state.originalObject[prop];
			debugLog(`Checking property ${String(prop)}, current:`, currentValue, `original:`, originalValue);
			if (!deepEquals(currentValue, originalValue)) {
				debugLog(`Property ${String(prop)} is different, returning false`);
				return false;
			}
		} else if (state.assigned_[prop] === false) {
			debugLog(`Property ${String(prop)} was deleted, returning false`);
			return false;
		}
		const symbolProps = Object.getOwnPropertySymbols(state.assigned_);
		for (const sym of symbolProps) if (state.assigned_[sym] === true) {
			const currentValue = state.copy_[sym];
			const originalValue = state.originalObject[sym];
			if (!deepEquals(currentValue, originalValue)) {
				debugLog(`Symbol property is different, returning false`);
				return false;
			}
		} else if (state.assigned_[sym] === false) {
			debugLog(`Symbol property was deleted, returning false`);
			return false;
		}
		debugLog(`All properties match original values, returning true`);
		return true;
	}
	function checkParentStatus(parentState, childProp) {
		debugLog(`checkParentStatus called for child prop:`, childProp);
		const isReverted = checkIfReverted(parentState);
		debugLog(`Parent checkIfReverted returned:`, isReverted);
		if (isReverted) {
			debugLog(`Parent is fully reverted, clearing tracking`);
			parentState.modified = false;
			parentState.assigned_ = {};
			if (parentState.parent) {
				debugLog(`Continuing up the parent chain`);
				checkParentStatus(parentState.parent.tracker, parentState.parent.prop);
			}
		}
	}
	function createObjectProxy(obj) {
		debugLog(`createObjectProxy`, obj);
		if (proxyCache.has(obj)) {
			debugLog(`proxyCache found match`);
			return proxyCache.get(obj);
		}
		const proxy2 = new Proxy(obj, {
			get(ptarget, prop) {
				debugLog(`get`, ptarget, prop);
				const value = changeTracker.copy_[prop] ?? changeTracker.originalObject[prop];
				const originalValue = changeTracker.originalObject[prop];
				debugLog(`value (at top of proxy get)`, value);
				if (Object.getOwnPropertyDescriptor(ptarget, prop)?.get) return value;
				if (typeof value === `function`) {
					if (Array.isArray(ptarget)) {
						const methodName = prop.toString();
						if (ARRAY_MODIFYING_METHODS.has(methodName)) return createModifyingMethodHandler(value, changeTracker, markChanged);
						const iterationHandler = createArrayIterationHandler(methodName, value, changeTracker, memoizedCreateChangeProxy);
						if (iterationHandler) return iterationHandler;
						if (prop === Symbol.iterator) return createArrayIteratorHandler(changeTracker, memoizedCreateChangeProxy);
					}
					if (ptarget instanceof Map || ptarget instanceof Set) {
						const methodName = prop.toString();
						if (MAP_SET_MODIFYING_METHODS.has(methodName)) return createModifyingMethodHandler(value, changeTracker, markChanged);
						const iteratorHandler = createMapSetIteratorHandler(methodName, prop, value, ptarget, changeTracker, memoizedCreateChangeProxy, markChanged);
						if (iteratorHandler) return iteratorHandler;
					}
					return value.bind(ptarget);
				}
				if (isProxiableObject(value)) {
					const { proxy: nestedProxy } = memoizedCreateChangeProxy(originalValue, {
						tracker: changeTracker,
						prop: String(prop)
					});
					proxyCache.set(value, nestedProxy);
					return nestedProxy;
				}
				return value;
			},
			set(_sobj, prop, value) {
				const currentValue = changeTracker.copy_[prop];
				debugLog(`set called for property ${String(prop)}, current:`, currentValue, `new:`, value);
				if (!deepEquals(currentValue, value)) {
					const originalValue = changeTracker.originalObject[prop];
					const isRevertToOriginal = deepEquals(value, originalValue);
					debugLog(`value:`, value, `original:`, originalValue, `isRevertToOriginal:`, isRevertToOriginal);
					if (isRevertToOriginal) {
						debugLog(`Reverting property ${String(prop)} to original value`);
						delete changeTracker.assigned_[prop.toString()];
						debugLog(`Updating copy with original value for ${String(prop)}`);
						changeTracker.copy_[prop] = deepClone(originalValue);
						debugLog(`Checking if all properties reverted`);
						const allReverted = checkIfReverted(changeTracker);
						debugLog(`All reverted:`, allReverted);
						if (allReverted) {
							debugLog(`All properties reverted, clearing tracking`);
							changeTracker.modified = false;
							changeTracker.assigned_ = {};
							if (parent) {
								debugLog(`Updating parent for property:`, parent.prop);
								checkParentStatus(parent.tracker, parent.prop);
							}
						} else {
							debugLog(`Some properties still changed, keeping modified flag`);
							changeTracker.modified = true;
						}
					} else {
						debugLog(`Setting new value for property ${String(prop)}`);
						changeTracker.copy_[prop] = value;
						changeTracker.assigned_[prop.toString()] = true;
						debugLog(`Marking object and ancestors as modified`, changeTracker);
						markChanged(changeTracker);
					}
				} else debugLog(`Value unchanged, not tracking`);
				return true;
			},
			defineProperty(ptarget, prop, descriptor) {
				const result = Reflect.defineProperty(ptarget, prop, descriptor);
				if (result && `value` in descriptor) {
					changeTracker.copy_[prop] = deepClone(descriptor.value);
					changeTracker.assigned_[prop.toString()] = true;
					markChanged(changeTracker);
				}
				return result;
			},
			getOwnPropertyDescriptor(ptarget, prop) {
				return Reflect.getOwnPropertyDescriptor(ptarget, prop);
			},
			preventExtensions(ptarget) {
				return Reflect.preventExtensions(ptarget);
			},
			isExtensible(ptarget) {
				return Reflect.isExtensible(ptarget);
			},
			deleteProperty(dobj, prop) {
				debugLog(`deleteProperty`, dobj, prop);
				const stringProp = typeof prop === `symbol` ? prop.toString() : prop;
				if (stringProp in dobj) {
					const hadPropertyInOriginal = stringProp in changeTracker.originalObject;
					const result = Reflect.deleteProperty(dobj, prop);
					if (result) if (!hadPropertyInOriginal) {
						delete changeTracker.assigned_[stringProp];
						if (Object.keys(changeTracker.assigned_).length === 0 && Object.getOwnPropertySymbols(changeTracker.assigned_).length === 0) changeTracker.modified = false;
						else changeTracker.modified = true;
					} else {
						changeTracker.assigned_[stringProp] = false;
						markChanged(changeTracker);
					}
					return result;
				}
				return true;
			}
		});
		proxyCache.set(obj, proxy2);
		return proxy2;
	}
	return {
		proxy: createObjectProxy(changeTracker.copy_),
		getChanges: () => {
			debugLog(`getChanges called, modified:`, changeTracker.modified);
			debugLog(changeTracker);
			if (!changeTracker.modified) {
				debugLog(`Object not modified, returning empty object`);
				return {};
			}
			if (typeof changeTracker.copy_ !== `object` || Array.isArray(changeTracker.copy_)) return changeTracker.copy_;
			if (Object.keys(changeTracker.assigned_).length === 0) return changeTracker.copy_;
			const result = {};
			for (const key in changeTracker.copy_) if (changeTracker.assigned_[key] === true && key in changeTracker.copy_) result[key] = changeTracker.copy_[key];
			debugLog(`Returning copy:`, result);
			return result;
		}
	};
}
function createArrayChangeProxy(targets) {
	const proxiesWithChanges = targets.map((target) => createChangeProxy(target));
	return {
		proxies: proxiesWithChanges.map((p) => p.proxy),
		getChanges: () => proxiesWithChanges.map((p) => p.getChanges())
	};
}
function withChangeTracking(target, callback) {
	const { proxy, getChanges } = createChangeProxy(target);
	callback(proxy);
	return getChanges();
}
function withArrayChangeTracking(targets, callback) {
	const { proxies, getChanges } = createArrayChangeProxy(targets);
	callback(proxies);
	return getChanges();
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/deferred.js
function createDeferred() {
	let resolve;
	let reject;
	let isPending = true;
	return {
		promise: new Promise((res, rej) => {
			resolve = (value) => {
				isPending = false;
				res(value);
			};
			reject = (reason) => {
				isPending = false;
				rej(reason);
			};
		}),
		resolve,
		reject,
		isPending: () => isPending
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/scheduler.js
function isPendingAwareJob(dep) {
	return typeof dep === `object` && dep !== null && typeof dep.hasPendingGraphRun === `function`;
}
var Scheduler = class {
	constructor() {
		this.contexts = /* @__PURE__ */ new Map();
		this.clearListeners = /* @__PURE__ */ new Set();
	}
	/**
	* Get or create the state bucket for a context.
	*/
	getOrCreateContext(contextId) {
		let context = this.contexts.get(contextId);
		if (!context) {
			context = {
				queue: [],
				jobs: /* @__PURE__ */ new Map(),
				dependencies: /* @__PURE__ */ new Map(),
				completed: /* @__PURE__ */ new Set()
			};
			this.contexts.set(contextId, context);
		}
		return context;
	}
	/**
	* Schedule work. Without a context id, executes immediately.
	* Otherwise queues the job to be flushed once dependencies are satisfied.
	* Scheduling the same jobId again replaces the previous run function.
	*/
	schedule({ contextId, jobId, dependencies, run }) {
		if (typeof contextId === `undefined`) {
			run();
			return;
		}
		const context = this.getOrCreateContext(contextId);
		if (!context.jobs.has(jobId)) context.queue.push(jobId);
		context.jobs.set(jobId, run);
		if (dependencies) {
			const depSet = new Set(dependencies);
			depSet.delete(jobId);
			context.dependencies.set(jobId, depSet);
		} else if (!context.dependencies.has(jobId)) context.dependencies.set(jobId, /* @__PURE__ */ new Set());
		context.completed.delete(jobId);
	}
	/**
	* Flush all queued work for a context. Jobs with unmet dependencies are retried.
	* Throws if a pass completes without running any job (dependency cycle).
	*/
	flush(contextId) {
		const context = this.contexts.get(contextId);
		if (!context) return;
		const { queue, jobs, dependencies, completed } = context;
		while (queue.length > 0) {
			let ranThisPass = false;
			const jobsThisPass = queue.length;
			for (let i = 0; i < jobsThisPass; i++) {
				const jobId = queue.shift();
				const run = jobs.get(jobId);
				if (!run) {
					dependencies.delete(jobId);
					completed.delete(jobId);
					continue;
				}
				const deps = dependencies.get(jobId);
				let ready = !deps;
				if (deps) {
					ready = true;
					for (const dep of deps) {
						if (dep === jobId) continue;
						const depHasPending = isPendingAwareJob(dep) && dep.hasPendingGraphRun(contextId);
						if (jobs.has(dep) && !completed.has(dep) || !jobs.has(dep) && depHasPending) {
							ready = false;
							break;
						}
					}
				}
				if (ready) {
					jobs.delete(jobId);
					dependencies.delete(jobId);
					run();
					completed.add(jobId);
					ranThisPass = true;
				} else queue.push(jobId);
			}
			if (!ranThisPass) throw new Error(`Scheduler detected unresolved dependencies for context ${String(contextId)}.`);
		}
		this.contexts.delete(contextId);
	}
	/**
	* Flush all contexts with pending work. Useful during tear-down.
	*/
	flushAll() {
		for (const contextId of Array.from(this.contexts.keys())) this.flush(contextId);
	}
	/** Clear all scheduled jobs for a context. */
	clear(contextId) {
		this.contexts.delete(contextId);
		this.clearListeners.forEach((listener) => listener(contextId));
	}
	/** Register a listener to be notified when a context is cleared. */
	onClear(listener) {
		this.clearListeners.add(listener);
		return () => this.clearListeners.delete(listener);
	}
	/** Check if a context has pending jobs. */
	hasPendingJobs(contextId) {
		const context = this.contexts.get(contextId);
		return !!context && context.jobs.size > 0;
	}
	/** Remove a single job from a context and clean up its dependencies. */
	clearJob(contextId, jobId) {
		const context = this.contexts.get(contextId);
		if (!context) return;
		context.jobs.delete(jobId);
		context.dependencies.delete(jobId);
		context.completed.delete(jobId);
		context.queue = context.queue.filter((id) => id !== jobId);
		if (context.jobs.size === 0) this.contexts.delete(contextId);
	}
};
var transactionScopedScheduler = new Scheduler();
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/transactions.js
var transactions = [];
var transactionStack = [];
var sequenceNumber = 0;
function mergePendingMutations(existing, incoming) {
	switch (`${existing.type}-${incoming.type}`) {
		case `insert-update`: return {
			...existing,
			type: `insert`,
			original: {},
			modified: incoming.modified,
			changes: {
				...existing.changes,
				...incoming.changes
			},
			key: existing.key,
			globalKey: existing.globalKey,
			metadata: incoming.metadata ?? existing.metadata,
			syncMetadata: {
				...existing.syncMetadata,
				...incoming.syncMetadata
			},
			mutationId: incoming.mutationId,
			updatedAt: incoming.updatedAt
		};
		case `insert-delete`: return null;
		case `update-delete`: return incoming;
		case `update-update`: return {
			...incoming,
			original: existing.original,
			changes: {
				...existing.changes,
				...incoming.changes
			},
			metadata: incoming.metadata ?? existing.metadata,
			syncMetadata: {
				...existing.syncMetadata,
				...incoming.syncMetadata
			}
		};
		case `delete-delete`:
		case `insert-insert`: return incoming;
		default: {
			const _exhaustive = `${existing.type}-${incoming.type}`;
			throw new Error(`Unhandled mutation combination: ${_exhaustive}`);
		}
	}
}
function createTransaction(config) {
	const newTransaction = new Transaction(config);
	transactions.push(newTransaction);
	return newTransaction;
}
function getActiveTransaction() {
	if (transactionStack.length > 0) return transactionStack.slice(-1)[0];
	else return;
}
function registerTransaction(tx) {
	transactionScopedScheduler.clear(tx.id);
	transactionStack.push(tx);
}
function unregisterTransaction(tx) {
	try {
		transactionScopedScheduler.flush(tx.id);
	} finally {
		transactionStack = transactionStack.filter((t) => t.id !== tx.id);
	}
}
function removeFromPendingList(tx) {
	const index = transactions.findIndex((t) => t.id === tx.id);
	if (index !== -1) transactions.splice(index, 1);
}
var Transaction = class {
	constructor(config) {
		if (typeof config.mutationFn === `undefined`) throw new MissingMutationFunctionError();
		this.id = config.id ?? crypto.randomUUID();
		this.mutationFn = config.mutationFn;
		this.state = `pending`;
		this.mutations = [];
		this.isPersisted = createDeferred();
		this.autoCommit = config.autoCommit ?? true;
		this.createdAt = /* @__PURE__ */ new Date();
		this.sequenceNumber = sequenceNumber++;
		this.metadata = config.metadata ?? {};
	}
	setState(newState) {
		this.state = newState;
		if (newState === `completed` || newState === `failed`) removeFromPendingList(this);
	}
	/**
	* Execute collection operations within this transaction
	* @param callback - Synchronous function containing collection operations to group together.
	* The transaction context is active only for the synchronous duration of this callback.
	* Async work should happen in `mutationFn`; collection operations after `await` boundaries
	* inside this callback will not be part of this transaction. For manual transactions, call
	* `mutate` multiple times before committing to add more synchronous operations to the same
	* transaction.
	* @returns This transaction for chaining
	* @example
	* // Group multiple operations
	* const tx = createTransaction({ mutationFn: async () => {
	*   // Send to API
	* }})
	*
	* tx.mutate(() => {
	*   collection.insert({ id: "1", text: "Buy milk" })
	*   collection.update("2", draft => { draft.completed = true })
	*   collection.delete("3")
	* })
	*
	* await tx.isPersisted.promise
	*
	* @example
	* // Handle mutate errors
	* try {
	*   tx.mutate(() => {
	*     collection.insert({ id: "invalid" }) // This might throw
	*   })
	* } catch (error) {
	*   console.log('Mutation failed:', error)
	* }
	*
	* @example
	* // Manual commit control
	* const tx = createTransaction({ autoCommit: false, mutationFn: async () => {} })
	*
	* tx.mutate(() => {
	*   collection.insert({ id: "1", text: "Item" })
	* })
	*
	* // Add more synchronous mutations to the same transaction
	* tx.mutate(() => {
	*   collection.update("1", draft => { draft.text = "Updated item" })
	* })
	*
	* // Commit later when ready
	* await tx.commit()
	*/
	mutate(callback) {
		if (this.state !== `pending`) throw new TransactionNotPendingMutateError();
		registerTransaction(this);
		try {
			callback();
		} finally {
			unregisterTransaction(this);
		}
		if (this.autoCommit) this.commit().catch(() => {});
		return this;
	}
	/**
	* Apply new mutations to this transaction, intelligently merging with existing mutations
	*
	* When mutations operate on the same item (same globalKey), they are merged according to
	* the following rules:
	*
	* - **insert + update** → insert (merge changes, keep empty original)
	* - **insert + delete** → removed (mutations cancel each other out)
	* - **update + delete** → delete (delete dominates)
	* - **update + update** → update (union changes, keep first original)
	* - **same type** → replace with latest
	*
	* This merging reduces over-the-wire churn and keeps the optimistic local view
	* aligned with user intent.
	*
	* @param mutations - Array of new mutations to apply
	*/
	applyMutations(mutations) {
		for (const newMutation of mutations) {
			const existingIndex = this.mutations.findIndex((m) => m.globalKey === newMutation.globalKey);
			if (existingIndex >= 0) {
				const existingMutation = this.mutations[existingIndex];
				const mergeResult = mergePendingMutations(existingMutation, newMutation);
				if (mergeResult === null) this.mutations.splice(existingIndex, 1);
				else this.mutations[existingIndex] = mergeResult;
			} else this.mutations.push(newMutation);
		}
	}
	/**
	* Rollback the transaction and any conflicting transactions
	* @param config - Configuration for rollback behavior
	* @returns This transaction for chaining
	* @example
	* // Manual rollback
	* const tx = createTransaction({ mutationFn: async () => {
	*   // Send to API
	* }})
	*
	* tx.mutate(() => {
	*   collection.insert({ id: "1", text: "Buy milk" })
	* })
	*
	* // Rollback if needed
	* if (shouldCancel) {
	*   tx.rollback()
	* }
	*
	* @example
	* // Handle rollback cascade (automatic)
	* const tx1 = createTransaction({ mutationFn: async () => {} })
	* const tx2 = createTransaction({ mutationFn: async () => {} })
	*
	* tx1.mutate(() => collection.update("1", draft => { draft.value = "A" }))
	* tx2.mutate(() => collection.update("1", draft => { draft.value = "B" })) // Same item
	*
	* tx1.rollback() // This will also rollback tx2 due to conflict
	*
	* @example
	* // Handle rollback in error scenarios
	* try {
	*   await tx.isPersisted.promise
	* } catch (error) {
	*   console.log('Transaction was rolled back:', error)
	*   // Transaction automatically rolled back on mutation function failure
	* }
	*/
	rollback(config) {
		const isSecondaryRollback = config?.isSecondaryRollback ?? false;
		if (this.state === `completed`) throw new TransactionAlreadyCompletedRollbackError();
		this.setState(`failed`);
		if (!isSecondaryRollback) {
			const mutationIds = /* @__PURE__ */ new Set();
			this.mutations.forEach((m) => mutationIds.add(m.globalKey));
			for (const t of transactions) t.state === `pending` && t.mutations.some((m) => mutationIds.has(m.globalKey)) && t.rollback({ isSecondaryRollback: true });
		}
		this.isPersisted.reject(this.error?.error);
		this.touchCollection();
		return this;
	}
	touchCollection() {
		const hasCalled = /* @__PURE__ */ new Set();
		for (const mutation of this.mutations) if (!hasCalled.has(mutation.collection.id)) {
			mutation.collection._state.onTransactionStateChange();
			if (mutation.collection._state.pendingSyncedTransactions.length > 0) mutation.collection._state.commitPendingTransactions();
			hasCalled.add(mutation.collection.id);
		}
	}
	/**
	* Commit the transaction and execute the mutation function
	* @returns Promise that resolves to this transaction when complete
	* @example
	* // Manual commit (when autoCommit is false)
	* const tx = createTransaction({
	*   autoCommit: false,
	*   mutationFn: async ({ transaction }) => {
	*     await api.saveChanges(transaction.mutations)
	*   }
	* })
	*
	* tx.mutate(() => {
	*   collection.insert({ id: "1", text: "Buy milk" })
	* })
	*
	* await tx.commit() // Manually commit
	*
	* @example
	* // Handle commit errors
	* try {
	*   const tx = createTransaction({
	*     mutationFn: async () => { throw new Error("API failed") }
	*   })
	*
	*   tx.mutate(() => {
	*     collection.insert({ id: "1", text: "Item" })
	*   })
	*
	*   await tx.commit()
	* } catch (error) {
	*   console.log('Commit failed, transaction rolled back:', error)
	* }
	*
	* @example
	* // Check transaction state after commit
	* await tx.commit()
	* console.log(tx.state) // "completed" or "failed"
	*/
	async commit() {
		if (this.state !== `pending`) throw new TransactionNotPendingCommitError();
		this.setState(`persisting`);
		if (this.mutations.length === 0) {
			this.setState(`completed`);
			this.isPersisted.resolve(this);
			return this;
		}
		try {
			await this.mutationFn({ transaction: this });
			this.setState(`completed`);
			this.touchCollection();
			this.isPersisted.resolve(this);
		} catch (error) {
			const originalError = error instanceof Error ? error : new Error(String(error));
			this.error = {
				message: originalError.message,
				error: originalError
			};
			this.rollback();
			throw originalError;
		}
		return this;
	}
	/**
	* Compare two transactions by their createdAt time and sequence number in order
	* to sort them in the order they were created.
	* @param other - The other transaction to compare to
	* @returns -1 if this transaction was created before the other, 1 if it was created after, 0 if they were created at the same time
	*/
	compareCreatedAt(other) {
		const createdAtComparison = this.createdAt.getTime() - other.createdAt.getTime();
		if (createdAtComparison !== 0) return createdAtComparison;
		return this.sequenceNumber - other.sequenceNumber;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/mutations.js
var CollectionMutationsManager = class {
	constructor(config, id) {
		this.insert = (data, config2) => {
			this.lifecycle.validateCollectionUsable(`insert`);
			const state = this.state;
			const ambientTransaction = getActiveTransaction();
			if (!ambientTransaction && !this.config.onInsert) throw new MissingInsertHandlerError();
			const items = Array.isArray(data) ? data : [data];
			const mutations = [];
			const keysInCurrentBatch = /* @__PURE__ */ new Set();
			items.forEach((item) => {
				const validatedData = this.validateData(item, `insert`);
				const key = this.config.getKey(validatedData);
				if (this.state.has(key) || keysInCurrentBatch.has(key)) throw new DuplicateKeyError(key);
				keysInCurrentBatch.add(key);
				const globalKey = this.generateGlobalKey(key, item);
				const mutation = {
					mutationId: crypto.randomUUID(),
					original: {},
					modified: validatedData,
					changes: Object.fromEntries(Object.keys(item).map((k) => [k, validatedData[k]])),
					globalKey,
					key,
					metadata: config2?.metadata,
					syncMetadata: this.config.sync.getSyncMetadata?.() || {},
					optimistic: config2?.optimistic ?? true,
					type: `insert`,
					createdAt: /* @__PURE__ */ new Date(),
					updatedAt: /* @__PURE__ */ new Date(),
					collection: this.collection
				};
				mutations.push(mutation);
			});
			if (ambientTransaction) {
				ambientTransaction.applyMutations(mutations);
				state.transactions.set(ambientTransaction.id, ambientTransaction);
				state.scheduleTransactionCleanup(ambientTransaction);
				state.recomputeOptimisticState(true);
				return ambientTransaction;
			} else {
				const directOpTransaction = createTransaction({
					metadata: { [DIRECT_TRANSACTION_METADATA_KEY]: true },
					mutationFn: async (params) => {
						return await this.config.onInsert({
							transaction: params.transaction,
							collection: this.collection
						});
					}
				});
				directOpTransaction.applyMutations(mutations);
				this.markPendingLocalOrigins(mutations);
				directOpTransaction.commit().catch(() => void 0);
				state.transactions.set(directOpTransaction.id, directOpTransaction);
				state.scheduleTransactionCleanup(directOpTransaction);
				state.recomputeOptimisticState(true);
				return directOpTransaction;
			}
		};
		this.delete = (keys, config2) => {
			const state = this.state;
			this.lifecycle.validateCollectionUsable(`delete`);
			const ambientTransaction = getActiveTransaction();
			if (!ambientTransaction && !this.config.onDelete) throw new MissingDeleteHandlerError();
			if (Array.isArray(keys) && keys.length === 0) throw new NoKeysPassedToDeleteError();
			const keysArray = Array.isArray(keys) ? keys : [keys];
			const mutations = [];
			for (const key of keysArray) {
				if (!this.state.has(key)) throw new DeleteKeyNotFoundError(key);
				const globalKey = this.generateGlobalKey(key, this.state.get(key));
				const mutation = {
					mutationId: crypto.randomUUID(),
					original: this.state.get(key),
					modified: this.state.get(key),
					changes: this.state.get(key),
					globalKey,
					key,
					metadata: config2?.metadata,
					syncMetadata: state.syncedMetadata.get(key) || {},
					optimistic: config2?.optimistic ?? true,
					type: `delete`,
					createdAt: /* @__PURE__ */ new Date(),
					updatedAt: /* @__PURE__ */ new Date(),
					collection: this.collection
				};
				mutations.push(mutation);
			}
			if (ambientTransaction) {
				ambientTransaction.applyMutations(mutations);
				state.transactions.set(ambientTransaction.id, ambientTransaction);
				state.scheduleTransactionCleanup(ambientTransaction);
				state.recomputeOptimisticState(true);
				return ambientTransaction;
			}
			const directOpTransaction = createTransaction({
				autoCommit: true,
				metadata: { [DIRECT_TRANSACTION_METADATA_KEY]: true },
				mutationFn: async (params) => {
					return this.config.onDelete({
						transaction: params.transaction,
						collection: this.collection
					});
				}
			});
			directOpTransaction.applyMutations(mutations);
			this.markPendingLocalOrigins(mutations);
			directOpTransaction.commit().catch(() => void 0);
			state.transactions.set(directOpTransaction.id, directOpTransaction);
			state.scheduleTransactionCleanup(directOpTransaction);
			state.recomputeOptimisticState(true);
			return directOpTransaction;
		};
		this.id = id;
		this.config = config;
	}
	setDeps(deps) {
		this.lifecycle = deps.lifecycle;
		this.state = deps.state;
		this.collection = deps.collection;
	}
	ensureStandardSchema(schema) {
		if (schema && `~standard` in schema) return schema;
		throw new InvalidSchemaError();
	}
	validateData(data, type, key) {
		if (!this.config.schema) return data;
		const standardSchema = this.ensureStandardSchema(this.config.schema);
		if (type === `update` && key) {
			const existingData = this.state.get(key);
			if (existingData && data && typeof data === `object` && typeof existingData === `object`) {
				const mergedData = Object.assign({}, existingData, data);
				const result2 = standardSchema[`~standard`].validate(mergedData);
				if (result2 instanceof Promise) throw new SchemaMustBeSynchronousError();
				if (`issues` in result2 && result2.issues) throw new SchemaValidationError(type, result2.issues.map((issue) => ({
					message: issue.message,
					path: issue.path?.map((p) => String(p))
				})));
				const validatedMergedData = result2.value;
				return Object.fromEntries(Object.keys(data).map((k) => [k, validatedMergedData[k]]));
			}
		}
		const result = standardSchema[`~standard`].validate(data);
		if (result instanceof Promise) throw new SchemaMustBeSynchronousError();
		if (`issues` in result && result.issues) throw new SchemaValidationError(type, result.issues.map((issue) => ({
			message: issue.message,
			path: issue.path?.map((p) => String(p))
		})));
		return result.value;
	}
	generateGlobalKey(key, item) {
		if (typeof key !== `string` && typeof key !== `number`) {
			if (typeof key === `undefined`) throw new UndefinedKeyError(item);
			throw new InvalidKeyError(key, item);
		}
		return `KEY::${this.id}/${key}`;
	}
	markPendingLocalOrigins(mutations) {
		for (const mutation of mutations) this.state.pendingLocalOrigins.add(mutation.key);
	}
	/**
	* Updates one or more items in the collection using a callback function
	*/
	update(keys, configOrCallback, maybeCallback) {
		if (typeof keys === `undefined`) throw new MissingUpdateArgumentError();
		const state = this.state;
		this.lifecycle.validateCollectionUsable(`update`);
		const ambientTransaction = getActiveTransaction();
		if (!ambientTransaction && !this.config.onUpdate) throw new MissingUpdateHandlerError();
		const isArray = Array.isArray(keys);
		const keysArray = isArray ? keys : [keys];
		if (isArray && keysArray.length === 0) throw new NoKeysPassedToUpdateError();
		const callback = typeof configOrCallback === `function` ? configOrCallback : maybeCallback;
		const config = typeof configOrCallback === `function` ? {} : configOrCallback;
		const currentObjects = keysArray.map((key) => {
			const item = this.state.get(key);
			if (!item) throw new UpdateKeyNotFoundError(key);
			return item;
		});
		let changesArray;
		if (isArray) changesArray = withArrayChangeTracking(currentObjects, callback);
		else changesArray = [withChangeTracking(currentObjects[0], callback)];
		const mutations = keysArray.map((key, index) => {
			const itemChanges = changesArray[index];
			if (!itemChanges || Object.keys(itemChanges).length === 0) return null;
			const originalItem = currentObjects[index];
			const validatedUpdatePayload = this.validateData(itemChanges, `update`, key);
			const modifiedItem = Object.assign({}, originalItem, validatedUpdatePayload);
			const originalItemId = this.config.getKey(originalItem);
			const modifiedItemId = this.config.getKey(modifiedItem);
			if (originalItemId !== modifiedItemId) throw new KeyUpdateNotAllowedError(originalItemId, modifiedItemId);
			const globalKey = this.generateGlobalKey(modifiedItemId, modifiedItem);
			return {
				mutationId: crypto.randomUUID(),
				original: originalItem,
				modified: modifiedItem,
				changes: Object.fromEntries(Object.keys(itemChanges).map((k) => [k, modifiedItem[k]])),
				globalKey,
				key,
				metadata: config.metadata,
				syncMetadata: state.syncedMetadata.get(key) || {},
				optimistic: config.optimistic ?? true,
				type: `update`,
				createdAt: /* @__PURE__ */ new Date(),
				updatedAt: /* @__PURE__ */ new Date(),
				collection: this.collection
			};
		}).filter(Boolean);
		if (mutations.length === 0) {
			const emptyTransaction = createTransaction({ mutationFn: async () => {} });
			emptyTransaction.commit().catch(() => void 0);
			state.scheduleTransactionCleanup(emptyTransaction);
			return emptyTransaction;
		}
		if (ambientTransaction) {
			ambientTransaction.applyMutations(mutations);
			state.transactions.set(ambientTransaction.id, ambientTransaction);
			state.scheduleTransactionCleanup(ambientTransaction);
			state.recomputeOptimisticState(true);
			return ambientTransaction;
		}
		const directOpTransaction = createTransaction({
			metadata: { [DIRECT_TRANSACTION_METADATA_KEY]: true },
			mutationFn: async (params) => {
				return this.config.onUpdate({
					transaction: params.transaction,
					collection: this.collection
				});
			}
		});
		directOpTransaction.applyMutations(mutations);
		this.markPendingLocalOrigins(mutations);
		directOpTransaction.commit().catch(() => void 0);
		state.transactions.set(directOpTransaction.id, directOpTransaction);
		state.scheduleTransactionCleanup(directOpTransaction);
		state.recomputeOptimisticState(true);
		return directOpTransaction;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/events.js
var CollectionEventsManager = class extends EventEmitter {
	constructor() {
		super();
	}
	setDeps(deps) {
		this.collection = deps.collection;
	}
	/**
	* Emit an event to all listeners
	* Public API for emitting collection events
	*/
	emit(event, eventPayload) {
		this.emitInner(event, eventPayload);
	}
	emitStatusChange(status, previousStatus) {
		this.emit(`status:change`, {
			type: `status:change`,
			collection: this.collection,
			previousStatus,
			status
		});
		const eventKey = `status:${status}`;
		this.emit(eventKey, {
			type: eventKey,
			collection: this.collection,
			previousStatus,
			status
		});
	}
	emitSubscribersChange(subscriberCount, previousSubscriberCount) {
		this.emit(`subscribers:change`, {
			type: `subscribers:change`,
			collection: this.collection,
			previousSubscriberCount,
			subscriberCount
		});
	}
	emitIndexAdded(index) {
		this.emit(`index:added`, {
			type: `index:added`,
			collection: this.collection,
			index
		});
	}
	emitIndexRemoved(index) {
		this.emit(`index:removed`, {
			type: `index:removed`,
			collection: this.collection,
			index
		});
	}
	cleanup() {
		this.clearListeners();
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/collection/index.js
function createCollection(options) {
	const collection = new CollectionImpl(options);
	if (options.utils) collection.utils = options.utils;
	else collection.utils = {};
	return collection;
}
var CollectionImpl = class {
	/**
	* Creates a new Collection instance
	*
	* @param config - Configuration object for the collection
	* @throws Error if sync config is missing
	*/
	constructor(config) {
		this.utils = {};
		this.deferDataRefresh = null;
		this.insert = (data, config2) => {
			return this._mutations.insert(data, config2);
		};
		this.delete = (keys, config2) => {
			return this._mutations.delete(keys, config2);
		};
		if (!config) throw new CollectionRequiresConfigError();
		if (!config.sync) throw new CollectionRequiresSyncConfigError();
		if (config.id) this.id = config.id;
		else this.id = crypto.randomUUID();
		this.config = {
			...config,
			autoIndex: config.autoIndex ?? `off`
		};
		if (this.config.autoIndex === `eager` && !config.defaultIndexType) throw new CollectionConfigurationError(`autoIndex: 'eager' requires defaultIndexType to be set. Import an index type and set it:
  import { BasicIndex } from '@tanstack/db'
  createCollection({ defaultIndexType: BasicIndex, autoIndex: 'eager', ... })`);
		this._changes = new CollectionChangesManager();
		this._events = new CollectionEventsManager();
		this._indexes = new CollectionIndexesManager();
		this._lifecycle = new CollectionLifecycleManager(config, this.id);
		this._mutations = new CollectionMutationsManager(config, this.id);
		this._state = new CollectionStateManager(config);
		this._sync = new CollectionSyncManager(config, this.id);
		this.comparisonOpts = buildCompareOptionsFromConfig(config);
		this._changes.setDeps({
			collection: this,
			lifecycle: this._lifecycle,
			sync: this._sync,
			events: this._events,
			state: this._state
		});
		this._events.setDeps({ collection: this });
		this._indexes.setDeps({
			state: this._state,
			lifecycle: this._lifecycle,
			defaultIndexType: config.defaultIndexType,
			events: this._events
		});
		this._lifecycle.setDeps({
			changes: this._changes,
			events: this._events,
			indexes: this._indexes,
			state: this._state,
			sync: this._sync
		});
		this._mutations.setDeps({
			collection: this,
			lifecycle: this._lifecycle,
			state: this._state
		});
		this._state.setDeps({
			collection: this,
			lifecycle: this._lifecycle,
			changes: this._changes,
			indexes: this._indexes,
			events: this._events
		});
		this._sync.setDeps({
			collection: this,
			state: this._state,
			lifecycle: this._lifecycle,
			events: this._events
		});
		if (config.startSync === true) this._sync.startSync();
	}
	/**
	* Gets the current status of the collection
	*/
	get status() {
		return this._lifecycle.status;
	}
	/**
	* Get the number of subscribers to the collection
	*/
	get subscriberCount() {
		return this._changes.activeSubscribersCount;
	}
	/**
	* Register a callback to be executed when the collection first becomes ready
	* Useful for preloading collections
	* @param callback Function to call when the collection first becomes ready
	* @example
	* collection.onFirstReady(() => {
	*   console.log('Collection is ready for the first time')
	*   // Safe to access collection.state now
	* })
	*/
	onFirstReady(callback) {
		return this._lifecycle.onFirstReady(callback);
	}
	/**
	* Check if the collection is ready for use
	* Returns true if the collection has been marked as ready by its sync implementation
	* @returns true if the collection is ready, false otherwise
	* @example
	* if (collection.isReady()) {
	*   console.log('Collection is ready, data is available')
	*   // Safe to access collection.state
	* } else {
	*   console.log('Collection is still loading')
	* }
	*/
	isReady() {
		return this._lifecycle.status === `ready`;
	}
	/**
	* Check if the collection is currently loading more data
	* @returns true if the collection has pending load more operations, false otherwise
	*/
	get isLoadingSubset() {
		return this._sync.isLoadingSubset;
	}
	/**
	* Start sync immediately - internal method for compiled queries
	* This bypasses lazy loading for special cases like live query results
	*/
	startSyncImmediate() {
		this._sync.startSync();
	}
	/**
	* Preload the collection data by starting sync if not already started
	* Multiple concurrent calls will share the same promise
	*/
	preload() {
		return this._sync.preload();
	}
	/**
	* Get the current value for a key (virtual derived state)
	*/
	get(key) {
		return this._state.getWithVirtualProps(key);
	}
	/**
	* Check if a key exists in the collection (virtual derived state)
	*/
	has(key) {
		return this._state.has(key);
	}
	/**
	* Get the current size of the collection (cached)
	*/
	get size() {
		return this._state.size;
	}
	/**
	* Get all keys (virtual derived state)
	*/
	*keys() {
		yield* this._state.keys();
	}
	/**
	* Get all values (virtual derived state)
	*/
	*values() {
		for (const key of this._state.keys()) {
			const value = this.get(key);
			if (value !== void 0) yield value;
		}
	}
	/**
	* Get all entries (virtual derived state)
	*/
	*entries() {
		for (const key of this._state.keys()) {
			const value = this.get(key);
			if (value !== void 0) yield [key, value];
		}
	}
	/**
	* Get all entries (virtual derived state)
	*/
	*[Symbol.iterator]() {
		yield* this.entries();
	}
	/**
	* Execute a callback for each entry in the collection
	*/
	forEach(callbackfn) {
		let index = 0;
		for (const [key, value] of this.entries()) callbackfn(value, key, index++);
	}
	/**
	* Create a new array with the results of calling a function for each entry in the collection
	*/
	map(callbackfn) {
		const result = [];
		let index = 0;
		for (const [key, value] of this.entries()) result.push(callbackfn(value, key, index++));
		return result;
	}
	getKeyFromItem(item) {
		return this.config.getKey(item);
	}
	/**
	* Creates an index on a collection for faster queries.
	* Indexes significantly improve query performance by allowing constant time lookups
	* and logarithmic time range queries instead of full scans.
	*
	* @param indexCallback - Function that extracts the indexed value from each item
	* @param config - Configuration including index type and type-specific options
	* @returns The created index
	*
	* @example
	* ```ts
	* import { BasicIndex } from '@tanstack/db'
	*
	* // Create an index with explicit type
	* const ageIndex = collection.createIndex((row) => row.age, {
	*   indexType: BasicIndex
	* })
	*
	* // Create an index with collection's default type
	* const nameIndex = collection.createIndex((row) => row.name)
	* ```
	*/
	createIndex(indexCallback, config = {}) {
		return this._indexes.createIndex(indexCallback, config);
	}
	/**
	* Removes an index created with createIndex.
	* Returns true when an index existed and was removed.
	*
	* Best-effort semantics: removing an index guarantees it is detached from
	* collection query planning. Existing index proxy references should be treated
	* as invalid after removal.
	*/
	removeIndex(indexOrId) {
		return this._indexes.removeIndex(indexOrId);
	}
	/**
	* Returns a snapshot of current index metadata sorted by indexId.
	* Persistence wrappers can use this to bootstrap index state if indexes were
	* created before event listeners were attached.
	*/
	getIndexMetadata() {
		return this._indexes.getIndexMetadataSnapshot();
	}
	/**
	* Get resolved indexes for query optimization
	*/
	get indexes() {
		return this._indexes.indexes;
	}
	/**
	* Validates the data against the schema
	*/
	validateData(data, type, key) {
		return this._mutations.validateData(data, type, key);
	}
	get compareOptions() {
		return { ...this.comparisonOpts };
	}
	update(keys, configOrCallback, maybeCallback) {
		return this._mutations.update(keys, configOrCallback, maybeCallback);
	}
	/**
	* Gets the current state of the collection as a Map
	* @returns Map containing all items in the collection, with keys as identifiers
	* @example
	* const itemsMap = collection.state
	* console.log(`Collection has ${itemsMap.size} items`)
	*
	* for (const [key, item] of itemsMap) {
	*   console.log(`${key}: ${item.title}`)
	* }
	*
	* // Check if specific item exists
	* if (itemsMap.has("todo-1")) {
	*   console.log("Todo 1 exists:", itemsMap.get("todo-1"))
	* }
	*/
	get state() {
		const result = /* @__PURE__ */ new Map();
		for (const [key, value] of this.entries()) result.set(key, value);
		return result;
	}
	/**
	* Gets the current state of the collection as a Map, but only resolves when data is available
	* Waits for the first sync commit to complete before resolving
	*
	* @returns Promise that resolves to a Map containing all items in the collection
	*/
	stateWhenReady() {
		if (this.size > 0 || this.isReady()) return Promise.resolve(this.state);
		return this.preload().then(() => this.state);
	}
	/**
	* Gets the current state of the collection as an Array
	*
	* @returns An Array containing all items in the collection
	*/
	get toArray() {
		return Array.from(this.values());
	}
	/**
	* Gets the current state of the collection as an Array, but only resolves when data is available
	* Waits for the first sync commit to complete before resolving
	*
	* @returns Promise that resolves to an Array containing all items in the collection
	*/
	toArrayWhenReady() {
		if (this.size > 0 || this.isReady()) return Promise.resolve(this.toArray);
		return this.preload().then(() => this.toArray);
	}
	/**
	* Returns the current state of the collection as an array of changes
	* @param options - Options including optional where filter
	* @returns An array of changes
	* @example
	* // Get all items as changes
	* const allChanges = collection.currentStateAsChanges()
	*
	* // Get only items matching a condition
	* const activeChanges = collection.currentStateAsChanges({
	*   where: (row) => row.status === 'active'
	* })
	*
	* // Get only items using a pre-compiled expression
	* const activeChanges = collection.currentStateAsChanges({
	*   whereExpression: eq(row.status, 'active')
	* })
	*/
	currentStateAsChanges(options = {}) {
		return currentStateAsChanges(this, options);
	}
	/**
	* Subscribe to changes in the collection
	* @param callback - Function called when items change
	* @param options - Subscription options including includeInitialState and where filter
	* @returns Unsubscribe function - Call this to stop listening for changes
	* @example
	* // Basic subscription
	* const subscription = collection.subscribeChanges((changes) => {
	*   changes.forEach(change => {
	*     console.log(`${change.type}: ${change.key}`, change.value)
	*   })
	* })
	*
	* // Later: subscription.unsubscribe()
	*
	* @example
	* // Include current state immediately
	* const subscription = collection.subscribeChanges((changes) => {
	*   updateUI(changes)
	* }, { includeInitialState: true })
	*
	* @example
	* // Subscribe only to changes matching a condition using where callback
	* import { eq } from "@tanstack/db"
	*
	* const subscription = collection.subscribeChanges((changes) => {
	*   updateUI(changes)
	* }, {
	*   includeInitialState: true,
	*   where: (row) => eq(row.status, "active")
	* })
	*
	* @example
	* // Using multiple conditions with and()
	* import { and, eq, gt } from "@tanstack/db"
	*
	* const subscription = collection.subscribeChanges((changes) => {
	*   updateUI(changes)
	* }, {
	*   where: (row) => and(eq(row.status, "active"), gt(row.priority, 5))
	* })
	*/
	subscribeChanges(callback, options = {}) {
		return this._changes.subscribeChanges(callback, options);
	}
	/**
	* Subscribe to a collection event
	*/
	on(event, callback) {
		return this._events.on(event, callback);
	}
	/**
	* Subscribe to a collection event once
	*/
	once(event, callback) {
		return this._events.once(event, callback);
	}
	/**
	* Unsubscribe from a collection event
	*/
	off(event, callback) {
		this._events.off(event, callback);
	}
	/**
	* Wait for a collection event
	*/
	waitFor(event, timeout) {
		return this._events.waitFor(event, timeout);
	}
	/**
	* Clean up the collection by stopping sync and clearing data
	* This can be called manually or automatically by garbage collection
	*/
	async cleanup() {
		this._lifecycle.cleanup();
		return Promise.resolve();
	}
};
function buildCompareOptionsFromConfig(config) {
	if (config.defaultStringCollation) {
		const options = config.defaultStringCollation;
		return {
			stringSort: options.stringSort ?? `locale`,
			locale: options.stringSort === `locale` ? options.locale : void 0,
			localeOptions: options.stringSort === `locale` ? options.localeOptions : void 0
		};
	} else return { stringSort: `locale` };
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/local-only.js
function localOnlyCollectionOptions(config) {
	const { initialData, onInsert, onUpdate, onDelete, id, ...restConfig } = config;
	const collectionId = id ?? crypto.randomUUID();
	const syncResult = createLocalOnlySync(initialData);
	const wrappedOnInsert = async (params) => {
		let handlerResult;
		if (onInsert) handlerResult = await onInsert(params) ?? {};
		syncResult.confirmOperationsSync(params.transaction.mutations);
		return handlerResult;
	};
	const wrappedOnUpdate = async (params) => {
		let handlerResult;
		if (onUpdate) handlerResult = await onUpdate(params) ?? {};
		syncResult.confirmOperationsSync(params.transaction.mutations);
		return handlerResult;
	};
	const wrappedOnDelete = async (params) => {
		let handlerResult;
		if (onDelete) handlerResult = await onDelete(params) ?? {};
		syncResult.confirmOperationsSync(params.transaction.mutations);
		return handlerResult;
	};
	const acceptMutations = (transaction) => {
		const collectionMutations = transaction.mutations.filter((m) => m.collection.id === collectionId);
		if (collectionMutations.length === 0) return;
		syncResult.confirmOperationsSync(collectionMutations);
	};
	return {
		...restConfig,
		id: collectionId,
		sync: syncResult.sync,
		onInsert: wrappedOnInsert,
		onUpdate: wrappedOnUpdate,
		onDelete: wrappedOnDelete,
		utils: { acceptMutations },
		startSync: true,
		gcTime: 0
	};
}
function createLocalOnlySync(initialData) {
	let syncBegin = null;
	let syncWrite = null;
	let syncCommit = null;
	let collection = null;
	const sync = {
		/**
		* Sync function that captures sync parameters and applies initial data
		* @param params - Sync parameters containing begin, write, and commit functions
		* @returns Unsubscribe function (empty since no ongoing sync is needed)
		*/
		sync: (params) => {
			const { begin, write, commit, markReady } = params;
			syncBegin = begin;
			syncWrite = write;
			syncCommit = commit;
			collection = params.collection;
			params.collection._state.isLocalOnly = true;
			if (initialData && initialData.length > 0) {
				for (const item of initialData) {
					const key = params.collection.getKeyFromItem(item);
					params.collection._state.pendingLocalChanges.add(key);
				}
				begin();
				initialData.forEach((item) => {
					write({
						type: `insert`,
						value: item
					});
				});
				commit();
			}
			markReady();
			return () => {};
		},
		/**
		* Get sync metadata - returns empty object for local-only collections
		* @returns Empty metadata object
		*/
		getSyncMetadata: () => ({})
	};
	const confirmOperationsSync = (mutations) => {
		if (!syncBegin || !syncWrite || !syncCommit) return;
		syncBegin();
		mutations.forEach((mutation) => {
			if (syncWrite) syncWrite({
				type: mutation.type,
				value: mutation.modified
			});
		});
		syncCommit();
	};
	return {
		sync,
		confirmOperationsSync,
		collection
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/optimizer.js
function optimizeQuery(query) {
	if (query.from.type === `unionAll`) return {
		optimizedQuery: {
			...query,
			from: new UnionAll(query.from.queries.map((branch) => optimizeQuery(branch).optimizedQuery))
		},
		sourceWhereClauses: /* @__PURE__ */ new Map()
	};
	const sourceWhereClauses = extractSourceWhereClauses(query);
	let optimized = query;
	let previousOptimized;
	let iterations = 0;
	const maxIterations = 10;
	while (iterations < maxIterations && !deepEquals(optimized, previousOptimized)) {
		previousOptimized = optimized;
		optimized = applyRecursiveOptimization(optimized);
		iterations++;
	}
	return {
		optimizedQuery: removeRedundantSubqueries(optimized),
		sourceWhereClauses
	};
}
function extractSourceWhereClauses(query) {
	const sourceWhereClauses = /* @__PURE__ */ new Map();
	if (!query.where || query.where.length === 0) return sourceWhereClauses;
	const groupedClauses = groupWhereClauses(splitAndClauses(query.where).map((clause) => analyzeWhereClause(clause)));
	const nullableSources = getNullableJoinSources(query);
	for (const [sourceAlias, whereClause] of groupedClauses.singleSource) if (isCollectionReference(query, sourceAlias) && !nullableSources.has(sourceAlias)) sourceWhereClauses.set(sourceAlias, whereClause);
	return sourceWhereClauses;
}
function isCollectionReference(query, sourceAlias) {
	for (const source of getFromSources$1(query.from)) if (source.alias === sourceAlias) return source.type === `collectionRef`;
	if (query.join) {
		for (const joinClause of query.join) if (joinClause.from.alias === sourceAlias) return joinClause.from.type === `collectionRef`;
	}
	return false;
}
function getNullableJoinSources(query) {
	const nullable = /* @__PURE__ */ new Set();
	if (query.join) {
		const leftAliases = new Set(getFromSources$1(query.from).map((source) => source.alias));
		for (const join of query.join) {
			const joinedAlias = join.from.alias;
			if (join.type === `left` || join.type === `full`) nullable.add(joinedAlias);
			if (join.type === `right` || join.type === `full`) for (const leftAlias of leftAliases) nullable.add(leftAlias);
			leftAliases.add(joinedAlias);
		}
	}
	return nullable;
}
function applyRecursiveOptimization(query) {
	return applySingleLevelOptimization({
		...query,
		from: optimizeNestedFrom(query.from),
		join: query.join?.map((joinClause) => ({
			...joinClause,
			from: joinClause.from.type === `queryRef` ? new QueryRef(applyRecursiveOptimization(joinClause.from.query), joinClause.from.alias) : joinClause.from
		}))
	});
}
function applySingleLevelOptimization(query) {
	if (!query.where || query.where.length === 0) return query;
	if (query.from.type === `unionFrom`) return query;
	if (!query.join || query.join.length === 0) {
		if (query.where.length > 1) {
			const combinedWhere = combineWithAnd(splitAndClauses(query.where));
			return {
				...query,
				where: [combinedWhere]
			};
		}
		return query;
	}
	const optimizedQuery = applyOptimizations(query, groupWhereClauses(splitAndClauses(query.where.filter((where) => !isResidualWhere(where))).map((clause) => analyzeWhereClause(clause))));
	const residualWhereClauses = query.where.filter((where) => isResidualWhere(where));
	if (residualWhereClauses.length > 0) optimizedQuery.where = [...optimizedQuery.where || [], ...residualWhereClauses];
	return optimizedQuery;
}
function removeRedundantSubqueries(query) {
	return {
		...query,
		from: removeRedundantFromClause(query.from),
		join: query.join?.map((joinClause) => ({
			...joinClause,
			from: removeRedundantJoinFromClause(joinClause.from)
		}))
	};
}
function removeRedundantFromClause(from) {
	if (from.type === `unionFrom`) return new UnionFrom(from.sources.map((source) => removeRedundantFromClause(source)));
	if (from.type === `unionAll`) return new UnionAll(from.queries.map((branch) => removeRedundantSubqueries(branch)));
	if (from.type === `collectionRef`) return from;
	const processedQuery = removeRedundantSubqueries(from.query);
	if (isRedundantSubquery(processedQuery)) {
		const innerFrom = removeRedundantFromClause(processedQuery.from);
		if (innerFrom.type === `collectionRef`) return new CollectionRef(innerFrom.collection, from.alias);
		else if (innerFrom.type === `queryRef`) return new QueryRef(innerFrom.query, from.alias);
	}
	return new QueryRef(processedQuery, from.alias);
}
function removeRedundantJoinFromClause(from) {
	return removeRedundantFromClause(from);
}
function isRedundantSubquery(query) {
	return (!query.where || query.where.length === 0) && !query.select && (!query.groupBy || query.groupBy.length === 0) && (!query.having || query.having.length === 0) && (!query.orderBy || query.orderBy.length === 0) && (!query.join || query.join.length === 0) && query.limit === void 0 && query.offset === void 0 && !query.fnSelect && (!query.fnWhere || query.fnWhere.length === 0) && (!query.fnHaving || query.fnHaving.length === 0);
}
function splitAndClauses(whereClauses) {
	const result = [];
	for (const whereClause of whereClauses) {
		const clause = getWhereExpression(whereClause);
		result.push(...splitAndClausesRecursive(clause));
	}
	return result;
}
function splitAndClausesRecursive(clause) {
	if (clause.type === `func` && clause.name === `and`) {
		const result = [];
		for (const arg of clause.args) result.push(...splitAndClausesRecursive(arg));
		return result;
	} else return [clause];
}
function analyzeWhereClause(clause) {
	const touchedSources = /* @__PURE__ */ new Set();
	let hasNamespaceOnlyRef = false;
	function collectSources(expr) {
		switch (expr.type) {
			case `ref`:
				if (expr.path && expr.path.length > 0) {
					const firstElement = expr.path[0];
					if (firstElement) {
						touchedSources.add(firstElement);
						if (expr.path.length === 1) hasNamespaceOnlyRef = true;
					}
				}
				break;
			case `func`:
				if (expr.args) expr.args.forEach(collectSources);
				break;
			case `val`: break;
			case `agg`:
				if (expr.args) expr.args.forEach(collectSources);
				break;
		}
	}
	collectSources(clause);
	return {
		expression: clause,
		touchedSources,
		hasNamespaceOnlyRef
	};
}
function groupWhereClauses(analyzedClauses) {
	const singleSource = /* @__PURE__ */ new Map();
	const multiSource = [];
	for (const clause of analyzedClauses) if (clause.touchedSources.size === 1 && !clause.hasNamespaceOnlyRef) {
		const source = Array.from(clause.touchedSources)[0];
		if (!singleSource.has(source)) singleSource.set(source, []);
		singleSource.get(source).push(clause.expression);
	} else if (clause.touchedSources.size > 1 || clause.hasNamespaceOnlyRef) multiSource.push(clause.expression);
	const combinedSingleSource = /* @__PURE__ */ new Map();
	for (const [source, clauses] of singleSource) combinedSingleSource.set(source, combineWithAnd(clauses));
	return {
		singleSource: combinedSingleSource,
		multiSource: multiSource.length > 0 ? combineWithAnd(multiSource) : void 0
	};
}
function applyOptimizations(query, groupedClauses) {
	const actuallyOptimized = /* @__PURE__ */ new Set();
	const nullableSources = getNullableJoinSources(query);
	const pushableSingleSource = /* @__PURE__ */ new Map();
	for (const [source, clause] of groupedClauses.singleSource) if (!nullableSources.has(source)) pushableSingleSource.set(source, clause);
	const optimizedFrom = optimizeFromWithTracking(query.from, pushableSingleSource, actuallyOptimized);
	const optimizedJoins = query.join ? query.join.map((joinClause) => ({
		...joinClause,
		from: optimizeJoinFromWithTracking(joinClause.from, pushableSingleSource, actuallyOptimized)
	})) : void 0;
	const remainingWhereClauses = [];
	if (groupedClauses.multiSource) remainingWhereClauses.push(groupedClauses.multiSource);
	const hasOuterJoins = nullableSources.size > 0;
	for (const [source, clause] of groupedClauses.singleSource) if (!actuallyOptimized.has(source)) remainingWhereClauses.push(clause);
	else if (hasOuterJoins) remainingWhereClauses.push(createResidualWhere(clause));
	const finalWhere = remainingWhereClauses.length > 1 ? [combineWithAnd(remainingWhereClauses.flatMap((clause) => splitAndClausesRecursive(getWhereExpression(clause))))] : remainingWhereClauses;
	return {
		select: query.select,
		groupBy: query.groupBy ? [...query.groupBy] : void 0,
		having: query.having ? [...query.having] : void 0,
		orderBy: query.orderBy ? [...query.orderBy] : void 0,
		limit: query.limit,
		offset: query.offset,
		distinct: query.distinct,
		fnSelect: query.fnSelect,
		fnWhere: query.fnWhere ? [...query.fnWhere] : void 0,
		fnHaving: query.fnHaving ? [...query.fnHaving] : void 0,
		from: optimizedFrom,
		join: optimizedJoins,
		where: finalWhere.length > 0 ? finalWhere : []
	};
}
function deepCopyQuery(query) {
	return {
		from: deepCopyFrom(query.from),
		select: query.select,
		join: query.join ? query.join.map((joinClause) => ({
			type: joinClause.type,
			left: joinClause.left,
			right: joinClause.right,
			from: deepCopyJoinFrom(joinClause.from)
		})) : void 0,
		where: query.where ? [...query.where] : void 0,
		groupBy: query.groupBy ? [...query.groupBy] : void 0,
		having: query.having ? [...query.having] : void 0,
		orderBy: query.orderBy ? [...query.orderBy] : void 0,
		limit: query.limit,
		offset: query.offset,
		fnSelect: query.fnSelect,
		fnWhere: query.fnWhere ? [...query.fnWhere] : void 0,
		fnHaving: query.fnHaving ? [...query.fnHaving] : void 0
	};
}
function deepCopyFrom(from) {
	if (from.type === `collectionRef`) return new CollectionRef(from.collection, from.alias);
	if (from.type === `queryRef`) return new QueryRef(deepCopyQuery(from.query), from.alias);
	if (from.type === `unionAll`) return new UnionAll(from.queries.map((branch) => deepCopyQuery(branch)));
	return new UnionFrom(from.sources.map((source) => deepCopyFrom(source)));
}
function deepCopyJoinFrom(from) {
	return deepCopyFrom(from);
}
function optimizeNestedFrom(from) {
	if (from.type === `queryRef`) return new QueryRef(applyRecursiveOptimization(from.query), from.alias);
	if (from.type === `unionFrom`) return new UnionFrom(from.sources.map((source) => optimizeNestedFrom(source)));
	if (from.type === `unionAll`) return new UnionAll(from.queries.map((branch) => applyRecursiveOptimization(branch)));
	return from;
}
function getFromSources$1(from) {
	if (from.type === `unionFrom`) return from.sources;
	if (from.type === `unionAll`) return [];
	return [from];
}
function getFirstFromAlias$2(query) {
	return getFromSources$1(query.from)[0]?.alias;
}
function optimizeFromWithTracking(from, singleSourceClauses, actuallyOptimized) {
	if (from.type === `unionFrom`) return new UnionFrom(from.sources.map((source) => optimizeJoinFromWithTracking(source, singleSourceClauses, actuallyOptimized)));
	if (from.type === `unionAll`) return new UnionAll(from.queries.map((branch) => deepCopyQuery(branch)));
	const whereClause = singleSourceClauses.get(from.alias);
	if (!whereClause) {
		if (from.type === `collectionRef`) return new CollectionRef(from.collection, from.alias);
		return new QueryRef(deepCopyQuery(from.query), from.alias);
	}
	if (from.type === `collectionRef`) {
		const subQuery = {
			from: new CollectionRef(from.collection, from.alias),
			where: [whereClause]
		};
		actuallyOptimized.add(from.alias);
		return new QueryRef(subQuery, from.alias);
	}
	if (!isSafeToPushIntoExistingSubquery(from.query, whereClause, from.alias)) return new QueryRef(deepCopyQuery(from.query), from.alias);
	if (referencesAliasWithRemappedSelect(from.query, whereClause, from.alias)) return new QueryRef(deepCopyQuery(from.query), from.alias);
	const existingWhere = from.query.where || [];
	const optimizedSubQuery = {
		...deepCopyQuery(from.query),
		where: [...existingWhere, whereClause]
	};
	actuallyOptimized.add(from.alias);
	return new QueryRef(optimizedSubQuery, from.alias);
}
function optimizeJoinFromWithTracking(from, singleSourceClauses, actuallyOptimized) {
	return optimizeFromWithTracking(from, singleSourceClauses, actuallyOptimized);
}
function unsafeSelect(query, whereClause, outerAlias) {
	if (!query.select) return false;
	return selectHasAggregates(query.select) || whereReferencesComputedSelectFields(query.select, whereClause, outerAlias);
}
function unsafeGroupBy(query) {
	return query.groupBy && query.groupBy.length > 0;
}
function unsafeHaving(query) {
	return query.having && query.having.length > 0;
}
function unsafeOrderBy(query) {
	return query.orderBy && query.orderBy.length > 0 && (query.limit !== void 0 || query.offset !== void 0);
}
function unsafeFnSelect(query) {
	return query.fnSelect || query.fnWhere && query.fnWhere.length > 0 || query.fnHaving && query.fnHaving.length > 0;
}
function isSafeToPushIntoExistingSubquery(query, whereClause, outerAlias) {
	return !(unsafeSelect(query, whereClause, outerAlias) || unsafeGroupBy(query) || unsafeHaving(query) || unsafeOrderBy(query) || unsafeFnSelect(query));
}
function selectHasAggregates(select) {
	for (const value of Object.values(select)) if (typeof value === `object`) {
		const v = value;
		if (v.type === `agg`) return true;
		if (!(`type` in v)) {
			if (selectHasAggregates(v)) return true;
		}
	}
	return false;
}
function collectRefs(expr) {
	const refs = [];
	if (expr == null || typeof expr !== `object`) return refs;
	switch (expr.type) {
		case `ref`:
			refs.push(expr);
			break;
		case `func`:
		case `agg`:
			for (const arg of expr.args ?? []) refs.push(...collectRefs(arg));
			break;
	}
	return refs;
}
function whereReferencesComputedSelectFields(select, whereClause, outerAlias) {
	const computed = /* @__PURE__ */ new Set();
	for (const [key, value] of Object.entries(select)) {
		if (key.startsWith(`__SPREAD_SENTINEL__`)) continue;
		if (value instanceof PropRef) continue;
		computed.add(key);
	}
	const refs = collectRefs(whereClause);
	for (const ref of refs) {
		const path = ref.path;
		if (!Array.isArray(path) || path.length < 2) continue;
		const alias = path[0];
		const field = path[1];
		if (alias !== outerAlias) continue;
		if (computed.has(field)) return true;
	}
	return false;
}
function referencesAliasWithRemappedSelect(subquery, whereClause, outerAlias) {
	const refs = collectRefs(whereClause);
	if (refs.every((ref) => ref.path[0] !== outerAlias)) return false;
	if (subquery.fnSelect) return true;
	const select = subquery.select;
	if (!select) return false;
	for (const ref of refs) {
		const path = ref.path;
		if (path.length < 2) continue;
		if (path[0] !== outerAlias) continue;
		const projected = select[path[1]];
		if (!projected) continue;
		if (!(projected instanceof PropRef)) return true;
		if (projected.path.length < 2) return true;
		const [innerAlias, innerField] = projected.path;
		const firstFromAlias = getFirstFromAlias$2(subquery);
		if (innerAlias !== outerAlias && innerAlias !== firstFromAlias) return true;
		if (innerField !== path[1]) return true;
	}
	return false;
}
function combineWithAnd(expressions) {
	if (expressions.length === 0) throw new CannotCombineEmptyExpressionListError();
	if (expressions.length === 1) return expressions[0];
	return new Func(`and`, expressions);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/compiler/lazy-targets.js
function getLazyLoadTargets(rawQuery, lazyFrom, lazyAlias, lazySourceExpr, lazySource, aliasRemapping) {
	if (lazyFrom.type === `unionFrom`) return getTargetsFromExpression(rawQuery, lazySourceExpr);
	if (lazyFrom.type === `queryRef` && containsUnionFrom(lazyFrom.query.from)) return dedupeLazyLoadTargets(getTargetsFromQueryRef(lazyFrom.query, lazyAlias, lazySourceExpr));
	if (!lazySource) return [];
	const lazySourceRef = toPropRef(lazySourceExpr);
	if (!lazySourceRef) return [];
	const followRefResult = followRef(rawQuery, lazySourceRef, lazySource);
	if (!followRefResult) return [];
	return [{
		alias: aliasRemapping[lazyAlias] || lazyAlias,
		collection: followRefResult.collection,
		path: followRefResult.path
	}];
}
function containsUnionFrom(from) {
	if (from.type === `unionFrom`) return true;
	if (from.type === `queryRef`) return containsUnionFrom(from.query.from);
	if (from.type === `unionAll`) return from.queries.some((query) => containsUnionFrom(query.from));
	return false;
}
function getTargetsFromQueryRef(query, outerAlias, expr) {
	if (!expr || typeof expr !== `object` || !(`type` in expr)) return [];
	const expression = expr;
	if (expression.type === `func` && expression.name === `coalesce`) return dedupeLazyLoadTargets(expression.args.flatMap((arg) => getTargetsFromQueryRef(query, outerAlias, arg)));
	const ref = toPropRef(expression);
	if (!ref || ref.path[0] !== outerAlias) return [];
	return getTargetsFromPropRef(query, new PropRef(ref.path.slice(1)));
}
function getTargetsFromExpression(query, expr) {
	if (!expr || typeof expr !== `object` || !(`type` in expr)) return [];
	const expression = expr;
	if (expression.type === `ref`) return getTargetsFromPropRef(query, expression);
	if (expression.type === `func` && expression.name === `coalesce`) return dedupeLazyLoadTargets(expression.args.flatMap((arg) => getTargetsFromExpression(query, arg)));
	return [];
}
function getTargetsFromPropRef(query, ref) {
	if (ref.path.length === 0) return [];
	if (ref.path.length === 1) {
		const field = ref.path[0];
		const selectedField = query.select?.[field];
		if (selectedField) return getTargetsFromExpression(query, selectedField);
		return [];
	}
	const [alias, ...path] = ref.path;
	const source = getSourceFromAlias(query, alias);
	if (!source) return [];
	if (source.type === `collectionRef`) return [{
		alias: source.alias,
		collection: source.collection,
		path
	}];
	if (source.query.limit || source.query.offset) return [];
	return getTargetsFromQueryRef(source.query, source.alias, ref);
}
function getSourceFromAlias(query, alias) {
	if (query.join) {
		for (const join of query.join) if (join.from.alias === alias) return join.from;
	}
	const from = query.from;
	return (from.type === `unionFrom` ? from.sources : from.type === `unionAll` ? [] : [from]).find((source) => source.alias === alias);
}
function dedupeLazyLoadTargets(targets) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const target of targets) {
		const key = `${target.alias}:${target.path.join(`.`)}`;
		if (!seen.has(key)) {
			seen.add(key);
			deduped.push(target);
		}
	}
	return deduped;
}
function toPropRef(expr) {
	if (expr instanceof PropRef) return expr;
	if (expr && typeof expr === `object` && `type` in expr && expr.type === `ref` && Array.isArray(expr.path)) return new PropRef(expr.path);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/compiler/joins.js
function processJoins(pipeline, joinClauses, sources, mainCollectionId, mainSource, allInputs, cache, queryMapping, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, rawQuery, onCompileSubquery, aliasToCollectionId, aliasRemapping, sourceWhereClauses) {
	let resultPipeline = pipeline;
	for (const joinClause of joinClauses) resultPipeline = processJoin(resultPipeline, joinClause, sources, mainCollectionId, mainSource, allInputs, cache, queryMapping, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, rawQuery, onCompileSubquery, aliasToCollectionId, aliasRemapping, sourceWhereClauses);
	return resultPipeline;
}
function processJoin(pipeline, joinClause, sources, mainCollectionId, mainSource, allInputs, cache, queryMapping, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, rawQuery, onCompileSubquery, aliasToCollectionId, aliasRemapping, sourceWhereClauses) {
	const isCollectionRef = joinClause.from.type === `collectionRef`;
	const { alias: joinedSource, input: joinedInput, collectionId: joinedCollectionId } = processJoinSource(joinClause.from, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, onCompileSubquery, aliasToCollectionId, aliasRemapping, sourceWhereClauses);
	sources[joinedSource] = joinedInput;
	if (isCollectionRef) aliasToCollectionId[joinedSource] = joinedCollectionId;
	const mainCollection = collections[mainCollectionId];
	const joinedCollection = collections[joinedCollectionId];
	if (!mainCollection) throw new JoinCollectionNotFoundError(mainCollectionId);
	if (!joinedCollection) throw new JoinCollectionNotFoundError(joinedCollectionId);
	const { activeSource, lazySource } = getActiveAndLazySources(joinClause.type, mainCollection, joinedCollection);
	const availableSources = Object.keys(sources);
	const { mainExpr, joinedExpr } = analyzeJoinExpressions(joinClause.left, joinClause.right, availableSources, joinedSource, rawQuery.from.type === `unionAll`);
	const compiledMainExpr = compileExpression(mainExpr);
	const compiledJoinedExpr = compileExpression(joinedExpr);
	let mainPipeline = pipeline.pipe(map(([currentKey, namespacedRow]) => {
		return [normalizeValue(compiledMainExpr(namespacedRow)), [currentKey, namespacedRow]];
	}));
	let joinedPipeline = joinedInput.pipe(map(([currentKey, row]) => {
		const namespacedRow = { [joinedSource]: row };
		return [normalizeValue(compiledJoinedExpr(namespacedRow)), [currentKey, namespacedRow]];
	}));
	if (![
		`inner`,
		`left`,
		`right`,
		`full`
	].includes(joinClause.type)) throw new UnsupportedJoinTypeError(joinClause.type);
	if (activeSource) {
		const lazyFrom = activeSource === `main` ? joinClause.from : rawQuery.from;
		const limitedSubquery = lazyFrom.type === `queryRef` && (lazyFrom.query.limit || lazyFrom.query.offset);
		const resultUnionLazySide = lazyFrom.type === `unionAll`;
		const lazySourceJoinExpr = activeSource === `main` ? joinedExpr : mainExpr;
		const lazyAlias = activeSource === `main` ? joinedSource : mainSource;
		const lazyTargets = resultUnionLazySide ? [] : getLazyLoadTargets(rawQuery, lazyFrom, lazyAlias, lazySourceJoinExpr, lazySource, aliasRemapping);
		if (!limitedSubquery && lazyTargets.length > 0) {
			for (const target of lazyTargets) lazySources.add(target.alias);
			const activePipeline = activeSource === `main` ? mainPipeline : joinedPipeline;
			for (const target of lazyTargets) {
				const fieldName = target.path[0];
				if (fieldName) ensureIndexForField(fieldName, target.path, target.collection);
			}
			const activePipelineWithLoading = activePipeline.pipe(tap((data) => {
				const joinKeys = [...new Set(data.getInner().map(([[joinKey]]) => joinKey).filter((key) => key != null))];
				if (joinKeys.length === 0) return;
				for (const target of lazyTargets) {
					const lazySourceSubscription = subscriptions[target.alias];
					if (!lazySourceSubscription) throw new SubscriptionNotFoundError(target.alias, lazyAlias, target.collection.id, Object.keys(subscriptions));
					if (lazySourceSubscription.hasLoadedInitialState()) continue;
					const lazyJoinRef = new PropRef(target.path);
					if (!lazySourceSubscription.requestSnapshot({
						where: inArray(lazyJoinRef, joinKeys),
						optimizedOnly: true
					})) {
						const collectionId = target.collection.id;
						const fieldPath = target.path.join(`.`);
						console.warn(`[TanStack DB]${collectionId ? ` [${collectionId}]` : ``} Join requires an index on "${fieldPath}" for efficient loading. Falling back to loading all data. Consider creating an index on the collection with collection.createIndex((row) => row.${fieldPath}) or enable auto-indexing with autoIndex: 'eager' and a defaultIndexType.`);
						lazySourceSubscription.requestSnapshot();
					}
				}
			}));
			if (activeSource === `main`) mainPipeline = activePipelineWithLoading;
			else joinedPipeline = activePipelineWithLoading;
		}
	}
	return mainPipeline.pipe(join(joinedPipeline, joinClause.type), processJoinResults(joinClause.type));
}
function analyzeJoinExpressions(left, right, allAvailableSourceAliases, joinedSource, allowResultFields = false) {
	const availableSources = allAvailableSourceAliases.filter((alias) => alias !== joinedSource);
	const leftSourceAliases = getSourceAliasesFromExpression(left);
	const rightSourceAliases = getSourceAliasesFromExpression(right);
	const leftReferencesJoined = leftSourceAliases.has(joinedSource);
	const rightReferencesJoined = rightSourceAliases.has(joinedSource);
	const leftAvailableAliases = [...leftSourceAliases].filter((alias) => availableSources.includes(alias) || allowResultFields && alias !== joinedSource);
	const rightAvailableAliases = [...rightSourceAliases].filter((alias) => availableSources.includes(alias) || allowResultFields && alias !== joinedSource);
	if (leftAvailableAliases.length > 0 && !leftReferencesJoined && rightReferencesJoined && rightAvailableAliases.length === 0) return {
		mainExpr: left,
		joinedExpr: right
	};
	if (leftReferencesJoined && leftAvailableAliases.length === 0 && rightAvailableAliases.length > 0 && !rightReferencesJoined) return {
		mainExpr: right,
		joinedExpr: left
	};
	if (leftSourceAliases.size === 0 || rightSourceAliases.size === 0) throw new InvalidJoinConditionSourceMismatchError();
	if (leftSourceAliases.size === 1 && rightSourceAliases.size === 1 && [...leftSourceAliases][0] === [...rightSourceAliases][0]) throw new InvalidJoinConditionSameSourceError([...leftSourceAliases][0]);
	if (leftAvailableAliases.length === 0) throw new InvalidJoinConditionLeftSourceError([...leftSourceAliases][0]);
	if (!rightReferencesJoined) throw new InvalidJoinConditionRightSourceError(joinedSource);
	throw new InvalidJoinCondition();
}
function getSourceAliasesFromExpression(expr) {
	switch (expr.type) {
		case `ref`: return new Set(expr.path[0] ? [expr.path[0]] : []);
		case `func`: {
			const sourceAliases = /* @__PURE__ */ new Set();
			for (const arg of expr.args) for (const alias of getSourceAliasesFromExpression(arg)) sourceAliases.add(alias);
			return sourceAliases;
		}
		default: return /* @__PURE__ */ new Set();
	}
}
function processJoinSource(from, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, onCompileSubquery, aliasToCollectionId, aliasRemapping, sourceWhereClauses) {
	switch (from.type) {
		case `collectionRef`: {
			const input = allInputs[from.alias];
			if (!input) throw new CollectionInputNotFoundError(from.alias, from.collection.id, Object.keys(allInputs));
			aliasToCollectionId[from.alias] = from.collection.id;
			return {
				alias: from.alias,
				input,
				collectionId: from.collection.id
			};
		}
		case `queryRef`: {
			const subQueryResult = onCompileSubquery(queryMapping.get(from.query) || from.query, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping);
			Object.assign(aliasToCollectionId, subQueryResult.aliasToCollectionId);
			Object.assign(aliasRemapping, subQueryResult.aliasRemapping);
			const isUserDefinedSubquery = queryMapping.has(from.query);
			const fromInnerAlias = getFirstFromAlias$1(from.query);
			if (!(!isUserDefinedSubquery && fromInnerAlias !== void 0 && from.alias === fromInnerAlias)) for (const [alias, whereClause] of subQueryResult.sourceWhereClauses) sourceWhereClauses.set(alias, whereClause);
			const innerAlias = Object.keys(subQueryResult.aliasToCollectionId).find((alias) => subQueryResult.aliasToCollectionId[alias] === subQueryResult.collectionId);
			if (innerAlias && innerAlias !== from.alias) aliasRemapping[from.alias] = innerAlias;
			const extractedInput = subQueryResult.pipeline.pipe(map((data) => {
				const [key, [value, _orderByIndex]] = data;
				return [key, value];
			}));
			return {
				alias: from.alias,
				input: extractedInput,
				collectionId: subQueryResult.collectionId
			};
		}
		default: throw new UnsupportedJoinSourceTypeError(from.type);
	}
}
function getFirstFromAlias$1(query) {
	if (query.from.type === `unionFrom`) return query.from.sources[0]?.alias;
	if (query.from.type === `unionAll`) return;
	return query.from.alias;
}
function processJoinResults(joinType) {
	return function(pipeline) {
		return pipeline.pipe(filter((result) => {
			const [_key, [main, joined]] = result;
			const mainNamespacedRow = main?.[1];
			const joinedNamespacedRow = joined?.[1];
			if (joinType === `inner`) return !!(mainNamespacedRow && joinedNamespacedRow);
			if (joinType === `left`) return !!mainNamespacedRow;
			if (joinType === `right`) return !!joinedNamespacedRow;
			return true;
		}), map((result) => {
			const [_key, [main, joined]] = result;
			const mainKey = main?.[0];
			const mainNamespacedRow = main?.[1];
			const joinedKey = joined?.[0];
			const joinedNamespacedRow = joined?.[1];
			const mergedNamespacedRow = {};
			if (mainNamespacedRow) Object.assign(mergedNamespacedRow, mainNamespacedRow);
			if (joinedNamespacedRow) Object.assign(mergedNamespacedRow, joinedNamespacedRow);
			return [`[${mainKey},${joinedKey}]`, mergedNamespacedRow];
		}));
	};
}
function getActiveAndLazySources(joinType, leftCollection, rightCollection) {
	switch (joinType) {
		case `left`: return {
			activeSource: `main`,
			lazySource: rightCollection
		};
		case `right`: return {
			activeSource: `joined`,
			lazySource: leftCollection
		};
		case `inner`: return leftCollection.size < rightCollection.size ? {
			activeSource: `main`,
			lazySource: rightCollection
		} : {
			activeSource: `joined`,
			lazySource: leftCollection
		};
		default: return {
			activeSource: void 0,
			lazySource: void 0
		};
	}
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/compiler/select.js
function unwrapVal(input) {
	if (input instanceof Value) return input.value;
	return input;
}
function processMerge(op, namespacedRow, selectResults) {
	const value = op.source(namespacedRow);
	if (value && typeof value === `object`) {
		let cursor = selectResults;
		const path = op.targetPath;
		if (path.length === 0) for (const [k, v] of Object.entries(value)) selectResults[k] = unwrapVal(v);
		else for (let i = 0; i < path.length; i++) {
			const seg = path[i];
			if (i === path.length - 1) {
				const dest = cursor[seg] ??= {};
				if (typeof dest === `object`) for (const [k, v] of Object.entries(value)) dest[k] = unwrapVal(v);
			} else {
				const next = cursor[seg];
				if (next == null || typeof next !== `object`) cursor[seg] = {};
				cursor = cursor[seg];
			}
		}
	}
}
function processNonMergeOp(op, namespacedRow, selectResults) {
	const path = op.alias.split(`.`);
	if (path.length === 1) selectResults[op.alias] = op.compiled(namespacedRow);
	else {
		let cursor = selectResults;
		for (let i = 0; i < path.length - 1; i++) {
			const seg = path[i];
			const next = cursor[seg];
			if (next == null || typeof next !== `object`) cursor[seg] = {};
			cursor = cursor[seg];
		}
		cursor[path[path.length - 1]] = unwrapVal(op.compiled(namespacedRow));
	}
}
function processRow([key, namespacedRow], ops) {
	const selectResults = {};
	for (const op of ops) if (op.kind === `merge`) processMerge(op, namespacedRow, selectResults);
	else processNonMergeOp(op, namespacedRow, selectResults);
	return [key, {
		...namespacedRow,
		$selected: selectResults
	}];
}
function processSelect(pipeline, select, _allInputs) {
	const ops = [];
	addFromObject([], select, ops);
	return pipeline.pipe(map((row) => processRow(row, ops)));
}
function compileSelectObject(obj) {
	const ops = [];
	addFromObject([], obj, ops);
	return (row) => {
		const selectResults = {};
		for (const op of ops) if (op.kind === `merge`) processMerge(op, row, selectResults);
		else processNonMergeOp(op, row, selectResults);
		return selectResults;
	};
}
function compileSelectValue(value) {
	if (value == null) return () => value;
	if (isConditionalSelectValue(value)) {
		if (containsAggregate(value)) return () => null;
		return compileConditionalSelect(value);
	}
	if (value instanceof Value) return () => value.value;
	if (value.type === `includesSubquery`) return () => null;
	if (isNestedSelectObject$2(value)) return compileSelectObject(value);
	if (isAggregateExpression(value) || containsAggregate(value)) return () => null;
	if (!isExpressionLike(value)) return () => value;
	return compileExpression(value);
}
function compileConditionalSelect(conditional) {
	const branches = conditional.branches.map((branch) => ({
		condition: compileExpression(branch.condition),
		value: compileSelectValue(branch.value)
	}));
	const defaultFn = conditional.defaultValue === void 0 ? void 0 : compileSelectValue(conditional.defaultValue);
	return (row) => {
		for (const branch of branches) if (isCaseWhenConditionTrue(branch.condition(row))) return branch.value(row);
		return defaultFn !== void 0 ? defaultFn(row) : null;
	};
}
function isAggregateExpression(expr) {
	return expr.type === `agg`;
}
function isNestedSelectObject$2(obj) {
	return obj && typeof obj === `object` && !isExpressionLike(obj);
}
function addFromObject(prefixPath, obj, ops) {
	for (const [key, value] of Object.entries(obj)) {
		if (key.startsWith(`__SPREAD_SENTINEL__`)) {
			const rest = key.slice(`__SPREAD_SENTINEL__`.length);
			const splitIndex = rest.lastIndexOf(`__`);
			const pathStr = splitIndex >= 0 ? rest.slice(0, splitIndex) : rest;
			const isRefExpr = value && typeof value === `object` && `type` in value && value.type === `ref`;
			if (pathStr.includes(`.`) || isRefExpr) {
				const targetPath = [...prefixPath];
				const compiled = compileExpression(isRefExpr ? value : new PropRef(pathStr.split(`.`)));
				ops.push({
					kind: `merge`,
					targetPath,
					source: compiled
				});
			} else {
				const tableAlias = pathStr;
				const targetPath = [...prefixPath];
				ops.push({
					kind: `merge`,
					targetPath,
					source: (row) => row[tableAlias]
				});
			}
			continue;
		}
		const expression = value;
		if (isConditionalSelectValue(expression)) {
			if (containsAggregate(expression)) {
				ops.push({
					kind: `field`,
					alias: [...prefixPath, key].join(`.`),
					compiled: () => null
				});
				continue;
			}
			ops.push({
				kind: `field`,
				alias: [...prefixPath, key].join(`.`),
				compiled: compileConditionalSelect(expression)
			});
			continue;
		}
		if (expression && expression.type === `includesSubquery`) {
			ops.push({
				kind: `field`,
				alias: [...prefixPath, key].join(`.`),
				compiled: () => null
			});
			continue;
		}
		if (isNestedSelectObject$2(expression)) {
			addFromObject([...prefixPath, key], expression, ops);
			continue;
		}
		if (isAggregateExpression(expression) || containsAggregate(expression)) ops.push({
			kind: `field`,
			alias: [...prefixPath, key].join(`.`),
			compiled: () => null
		});
		else {
			if (expression === void 0 || !isExpressionLike(expression)) {
				ops.push({
					kind: `field`,
					alias: [...prefixPath, key].join(`.`),
					compiled: () => expression
				});
				continue;
			}
			if (expression instanceof Value) {
				const val = expression.value;
				ops.push({
					kind: `field`,
					alias: [...prefixPath, key].join(`.`),
					compiled: () => val
				});
			} else ops.push({
				kind: `field`,
				alias: [...prefixPath, key].join(`.`),
				compiled: compileExpression(expression)
			});
		}
	}
}
function isConditionalSelectValue(value) {
	return value instanceof ConditionalSelect || value != null && typeof value === `object` && value.type === `conditionalSelect` && Array.isArray(value.branches);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/compiler/index.js
var INCLUDES_ROUTING = /* @__PURE__ */ Symbol(`includesRouting`);
var FN_SELECT_STATE = /* @__PURE__ */ Symbol(`fnSelectState`);
var SKIP_INCLUDE = /* @__PURE__ */ Symbol(`skipInclude`);
function compileQuery(rawQuery, inputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache = /* @__PURE__ */ new WeakMap(), queryMapping = /* @__PURE__ */ new WeakMap(), parentKeyStream, childCorrelationField) {
	const cachedResult = cache.get(rawQuery);
	if (cachedResult) return cachedResult;
	validateQueryStructure(rawQuery);
	const { optimizedQuery, sourceWhereClauses } = optimizeQuery(rawQuery);
	let query = optimizedQuery;
	queryMapping.set(query, rawQuery);
	mapNestedQueries(query, rawQuery, queryMapping);
	const allInputs = { ...inputs };
	const aliasToCollectionId = {};
	const aliasRemapping = {};
	const sources = {};
	const { alias: mainSource, collectionId: mainCollectionId, pipeline: initialPipeline, sources: fromSources, sourceIncludes, directIncludes, isUnionFrom } = processFromClause(query.from, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, aliasToCollectionId, aliasRemapping, sourceWhereClauses);
	Object.assign(sources, fromSources);
	let pipeline = initialPipeline;
	if (!isUnionFrom && parentKeyStream && childCorrelationField) {
		const mainInput = sources[mainSource];
		let filteredMainInput = mainInput;
		const childFieldPath = childCorrelationField.path.slice(1);
		filteredMainInput = mainInput.pipe(map(([key, row]) => {
			return [getNestedValue(row, childFieldPath), [key, row]];
		})).pipe(join(parentKeyStream, `inner`)).pipe(filter(([_correlationValue, [childSide]]) => {
			return childSide != null;
		}), map(([correlationValue, [childSide, parentSide]]) => {
			const [childKey, childRow] = childSide;
			const tagged = {
				...childRow,
				__correlationKey: correlationValue
			};
			if (parentSide != null) tagged.__parentContext = parentSide;
			return [parentSide != null ? `${String(childKey)}::${JSON.stringify(parentSide)}` : childKey, tagged];
		}));
		sources[mainSource] = filteredMainInput;
		pipeline = wrapInputWithAlias(filteredMainInput, mainSource);
	}
	if (query.join && query.join.length > 0) pipeline = processJoins(pipeline, query.join, sources, mainCollectionId, mainSource, allInputs, cache, queryMapping, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, rawQuery, compileQuery, aliasToCollectionId, aliasRemapping, sourceWhereClauses);
	if (query.where && query.where.length > 0) for (const where of query.where) {
		const compiledWhere = compileExpression(getWhereExpression(where));
		pipeline = pipeline.pipe(filter(([_key, namespacedRow]) => {
			return toBooleanPredicate(compiledWhere(namespacedRow));
		}));
	}
	if (query.fnWhere && query.fnWhere.length > 0) for (const fnWhere of query.fnWhere) pipeline = pipeline.pipe(filter(([_key, namespacedRow]) => {
		return toBooleanPredicate(fnWhere(namespacedRow));
	}));
	const includesResults = !query.select ? [...directIncludes] : [];
	const includesRoutingFns = [];
	for (const { sourceAlias, include } of sourceIncludes) {
		const projectedPaths = query.select != null ? findProjectedSourceIncludePaths(query.select, sourceAlias, include.resultPath) : query.fnSelect ? [] : [{
			path: [sourceAlias, ...include.resultPath],
			guards: []
		}];
		if (projectedPaths.length === 0) continue;
		for (const { path: resultPath, guards } of projectedPaths) {
			const fieldName = getUniqueIncludesRoutingKey(`${sourceAlias}.${resultPath.join(`.`)}`, includesRoutingFns);
			const compiledGuards = guards.map((guard) => ({
				condition: compileExpression(guard.condition),
				expected: guard.expected
			}));
			includesResults.push({
				...include,
				fieldName,
				resultPath
			});
			includesRoutingFns.push({
				fieldName,
				getRouting: (nsRow) => {
					if (!matchesConditionalSelectGuards(compiledGuards, nsRow)) return {
						correlationKey: null,
						parentContext: null
					};
					return nsRow[sourceAlias]?.[INCLUDES_ROUTING]?.[include.fieldName] ?? {
						correlationKey: null,
						parentContext: null
					};
				}
			});
		}
	}
	if (query.select && directIncludes.length > 0) for (const include of directIncludes) {
		const projectedPaths = findProjectedResultIncludePaths(query.select, include.resultPath);
		for (const { path: resultPath, guards } of projectedPaths) {
			const fieldName = getUniqueIncludesRoutingKey(resultPath.join(`.`), includesRoutingFns);
			const compiledGuards = guards.map((guard) => ({
				condition: compileExpression(guard.condition),
				expected: guard.expected
			}));
			includesResults.push({
				...include,
				fieldName,
				resultPath
			});
			includesRoutingFns.push({
				fieldName,
				getRouting: (nsRow) => {
					if (!matchesConditionalSelectGuards(compiledGuards, nsRow)) return {
						correlationKey: null,
						parentContext: null
					};
					return nsRow[INCLUDES_ROUTING]?.[include.fieldName] ?? {
						correlationKey: null,
						parentContext: null
					};
				}
			});
		}
	}
	if (query.select) {
		const includesEntries = extractIncludesFromSelect(query.select);
		if (includesEntries.length > 0) query = {
			...query,
			select: { ...query.select }
		};
		for (const { key, path, subquery, guards } of includesEntries) {
			const fieldName = getUniqueIncludesRoutingKey(key, includesRoutingFns);
			const compiledCorrelation = compileExpression(subquery.correlationField);
			const compiledGuards = guards.map((guard) => ({
				condition: compileExpression(guard.condition),
				expected: guard.expected
			}));
			let parentKeys;
			if (subquery.parentProjection && subquery.parentProjection.length > 0) {
				const compiledProjections = subquery.parentProjection.map((ref) => ({
					alias: ref.path[0],
					field: ref.path.slice(1),
					compiled: compileExpression(ref)
				}));
				parentKeys = pipeline.pipe(map(([_key, nsRow]) => {
					if (!matchesConditionalSelectGuards(compiledGuards, nsRow)) return [SKIP_INCLUDE, null];
					const parentContext = {};
					for (const proj of compiledProjections) {
						if (!parentContext[proj.alias]) parentContext[proj.alias] = {};
						const value = proj.compiled(nsRow);
						let target = parentContext[proj.alias];
						for (let i = 0; i < proj.field.length - 1; i++) {
							if (!target[proj.field[i]]) target[proj.field[i]] = {};
							target = target[proj.field[i]];
						}
						target[proj.field[proj.field.length - 1]] = value;
					}
					return [compiledCorrelation(nsRow), parentContext];
				}));
			} else parentKeys = pipeline.pipe(map(([_key, nsRow]) => {
				if (!matchesConditionalSelectGuards(compiledGuards, nsRow)) return [SKIP_INCLUDE, null];
				return [compiledCorrelation(nsRow), null];
			}));
			parentKeys = parentKeys.pipe(filter(([correlationValue]) => correlationValue !== SKIP_INCLUDE));
			parentKeys = parentKeys.pipe(reduce((values) => values.map(([v, mult]) => [v, mult > 0 ? 1 : 0])));
			const childCorrelationAlias = subquery.childCorrelationField.path[0];
			const directChildCollection = subquery.query.from.type === `collectionRef` ? subquery.query.from.collection : void 0;
			const lazyTargets = getLazyLoadTargets(subquery.query, subquery.query.from, childCorrelationAlias, subquery.childCorrelationField, directChildCollection, aliasRemapping);
			if (lazyTargets.length > 0) {
				for (const target of lazyTargets) lazySources.add(target.alias);
				for (const target of lazyTargets) {
					const targetFieldName = target.path[0];
					if (targetFieldName) ensureIndexForField(targetFieldName, target.path, target.collection);
				}
				parentKeys = parentKeys.pipe(tap((data) => {
					const joinKeys = [...new Set(data.getInner().map(([[correlationValue]]) => correlationValue).filter((joinKey) => joinKey != null))];
					if (joinKeys.length === 0) return;
					for (const target of lazyTargets) {
						const lazySourceSubscription = subscriptions[target.alias];
						if (!lazySourceSubscription) continue;
						if (lazySourceSubscription.hasLoadedInitialState()) continue;
						const lazyJoinRef = new PropRef(target.path);
						lazySourceSubscription.requestSnapshot({ where: inArray(lazyJoinRef, joinKeys) });
					}
				}));
			}
			const childResult = compileQuery(subquery.parentFilters && subquery.parentFilters.length > 0 ? {
				...subquery.query,
				where: [...subquery.query.where || [], ...subquery.parentFilters]
			} : subquery.query, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, parentKeys, subquery.childCorrelationField);
			Object.assign(aliasToCollectionId, childResult.aliasToCollectionId);
			Object.assign(aliasRemapping, childResult.aliasRemapping);
			for (const [alias, whereClause] of childResult.sourceWhereClauses) sourceWhereClauses.set(alias, whereClause);
			includesResults.push({
				pipeline: childResult.pipeline,
				fieldName,
				resultPath: path,
				correlationField: subquery.correlationField,
				childCorrelationField: subquery.childCorrelationField,
				hasOrderBy: !!(subquery.query.orderBy && subquery.query.orderBy.length > 0),
				childCompilationResult: childResult,
				parentProjection: subquery.parentProjection,
				materialization: subquery.materialization,
				scalarField: subquery.scalarField
			});
			if (subquery.parentProjection && subquery.parentProjection.length > 0) {
				const compiledProjs = subquery.parentProjection.map((ref) => ({
					alias: ref.path[0],
					field: ref.path.slice(1),
					compiled: compileExpression(ref)
				}));
				const compiledCorr = compiledCorrelation;
				const compiledRoutingGuards = compiledGuards;
				includesRoutingFns.push({
					fieldName,
					getRouting: (nsRow) => {
						if (!matchesConditionalSelectGuards(compiledRoutingGuards, nsRow)) return {
							correlationKey: null,
							parentContext: null
						};
						const parentContext = {};
						for (const proj of compiledProjs) {
							if (!parentContext[proj.alias]) parentContext[proj.alias] = {};
							const value = proj.compiled(nsRow);
							let target = parentContext[proj.alias];
							for (let i = 0; i < proj.field.length - 1; i++) {
								if (!target[proj.field[i]]) target[proj.field[i]] = {};
								target = target[proj.field[i]];
							}
							target[proj.field[proj.field.length - 1]] = value;
						}
						return {
							correlationKey: compiledCorr(nsRow),
							parentContext
						};
					}
				});
			} else {
				const compiledRoutingGuards = compiledGuards;
				includesRoutingFns.push({
					fieldName,
					getRouting: (nsRow) => {
						if (!matchesConditionalSelectGuards(compiledRoutingGuards, nsRow)) return {
							correlationKey: null,
							parentContext: null
						};
						return {
							correlationKey: compiledCorrelation(nsRow),
							parentContext: null
						};
					}
				});
			}
			query = {
				...query,
				select: replaceIncludesInSelect(query.select, path)
			};
		}
	}
	if (query.distinct && !query.fnSelect && !query.select && query.from.type !== `unionAll`) throw new DistinctRequiresSelectError();
	if (query.fnSelect && query.groupBy && query.groupBy.length > 0) throw new FnSelectWithGroupByError();
	if (query.fnSelect) pipeline = pipeline.pipe(map(([key, namespacedRow]) => {
		const selectResults = query.fnSelect(namespacedRow);
		if (selectResults && typeof selectResults === `object`) {
			const routing = namespacedRow[INCLUDES_ROUTING];
			if (routing) selectResults[INCLUDES_ROUTING] = routing;
			if (directIncludes.length > 0) Object.defineProperty(selectResults, FN_SELECT_STATE, {
				value: {
					sourceRow: namespacedRow,
					fnSelect: query.fnSelect
				},
				enumerable: true,
				configurable: true
			});
		}
		return [key, {
			...namespacedRow,
			$selected: selectResults
		}];
	}));
	else if (query.select) pipeline = processSelect(pipeline, query.select);
	else pipeline = pipeline.pipe(map(([key, namespacedRow]) => {
		const selectResults = !isUnionFrom && !query.join && !query.groupBy ? namespacedRow[mainSource] : namespacedRow;
		return [key, {
			...namespacedRow,
			$selected: selectResults
		}];
	}));
	if (includesRoutingFns.length > 0) pipeline = pipeline.pipe(map(([key, namespacedRow]) => {
		const routing = {};
		for (const { fieldName, getRouting } of includesRoutingFns) routing[fieldName] = getRouting(namespacedRow);
		namespacedRow.$selected[INCLUDES_ROUTING] = routing;
		return [key, namespacedRow];
	}));
	const groupByMainSource = parentKeyStream ? mainSource : void 0;
	if (query.groupBy && query.groupBy.length > 0) pipeline = processGroupBy(pipeline, query.groupBy, query.having, query.select, query.fnHaving, mainCollectionId, groupByMainSource);
	else if (query.select) {
		if (Object.values(query.select).some((expr) => expr.type === `agg` || containsAggregate(expr))) pipeline = processGroupBy(pipeline, [], query.having, query.select, query.fnHaving, mainCollectionId, groupByMainSource);
	}
	if (query.having && (!query.groupBy || query.groupBy.length === 0)) {
		if (!(query.select ? Object.values(query.select).some((expr) => expr.type === `agg`) : false)) throw new HavingRequiresGroupByError();
	}
	if (query.fnHaving && query.fnHaving.length > 0 && (!query.groupBy || query.groupBy.length === 0)) for (const fnHaving of query.fnHaving) pipeline = pipeline.pipe(filter(([_key, namespacedRow]) => {
		return fnHaving(namespacedRow);
	}));
	if (query.distinct) pipeline = pipeline.pipe(distinct(([_key, row]) => row.$selected));
	if (query.orderBy && query.orderBy.length > 0) {
		const includesGroupKeyFn = parentKeyStream && (query.limit !== void 0 || query.offset !== void 0) ? (_key, row) => {
			const correlationKey = row?.[mainSource]?.__correlationKey;
			const parentContext = row?.__parentContext;
			if (parentContext != null) return JSON.stringify([correlationKey, parentContext]);
			return correlationKey;
		} : void 0;
		const compilationResult2 = {
			collectionId: mainCollectionId,
			pipeline: processOrderBy(rawQuery, pipeline, query.orderBy, query.select || {}, collections[mainCollectionId], optimizableOrderByCollections, setWindowFn, query.limit, query.offset, includesGroupKeyFn).pipe(map(([key, [row, orderByIndex]]) => {
				const raw = row.$selected;
				const finalResults = attachVirtualPropsToSelected(unwrapValue(raw), row);
				if (parentKeyStream) {
					const correlationKey = row[mainSource]?.__correlationKey;
					const parentContext = row.__parentContext ?? null;
					delete finalResults.__correlationKey;
					delete finalResults.__parentContext;
					return [key, [
						finalResults,
						orderByIndex,
						correlationKey,
						parentContext
					]];
				}
				return [key, [finalResults, orderByIndex]];
			})),
			sourceWhereClauses,
			aliasToCollectionId,
			aliasRemapping,
			includes: includesResults.length > 0 ? includesResults : void 0
		};
		cache.set(rawQuery, compilationResult2);
		return compilationResult2;
	} else if (query.limit !== void 0 || query.offset !== void 0) throw new LimitOffsetRequireOrderByError();
	const compilationResult = {
		collectionId: mainCollectionId,
		pipeline: pipeline.pipe(map(([key, row]) => {
			const raw = row.$selected;
			const finalResults = attachVirtualPropsToSelected(unwrapValue(raw), row);
			if (parentKeyStream) {
				const correlationKey = row[mainSource]?.__correlationKey;
				const parentContext = row.__parentContext ?? null;
				delete finalResults.__correlationKey;
				delete finalResults.__parentContext;
				return [key, [
					finalResults,
					void 0,
					correlationKey,
					parentContext
				]];
			}
			return [key, [finalResults, void 0]];
		})),
		sourceWhereClauses,
		aliasToCollectionId,
		aliasRemapping,
		includes: includesResults.length > 0 ? includesResults : void 0
	};
	cache.set(rawQuery, compilationResult);
	return compilationResult;
}
function collectDirectCollectionAliases(query) {
	const aliases = /* @__PURE__ */ new Set();
	for (const source of getFromSources(query.from)) if (source.type === `collectionRef`) aliases.add(source.alias);
	if (query.join) {
		for (const joinClause of query.join) if (joinClause.from.type === `collectionRef`) aliases.add(joinClause.from.alias);
	}
	return aliases;
}
function validateQueryStructure(query, parentCollectionAliases = /* @__PURE__ */ new Set()) {
	const currentLevelAliases = collectDirectCollectionAliases(query);
	for (const alias of currentLevelAliases) if (parentCollectionAliases.has(alias)) throw new DuplicateAliasInSubqueryError(alias, Array.from(parentCollectionAliases));
	const combinedAliases = /* @__PURE__ */ new Set([...parentCollectionAliases, ...currentLevelAliases]);
	if (query.from.type === `unionAll`) for (const branch of query.from.queries) validateQueryStructure(branch, combinedAliases);
	else for (const source of getFromSources(query.from)) if (source.type === `queryRef`) validateQueryStructure(source.query, combinedAliases);
	if (query.join) {
		for (const joinClause of query.join) if (joinClause.from.type === `queryRef`) validateQueryStructure(joinClause.from.query, combinedAliases);
	}
}
function processFromClause(from, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, aliasToCollectionId, aliasRemapping, sourceWhereClauses) {
	if (from.type === `unionAll`) return processUnionAll(from, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, aliasToCollectionId, aliasRemapping, sourceWhereClauses);
	if (from.type !== `unionFrom`) {
		const { alias, input, collectionId, sourceIncludes: sourceIncludes2 } = processFrom(from, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, aliasToCollectionId, aliasRemapping, sourceWhereClauses);
		return {
			alias,
			pipeline: wrapInputWithAlias(input, alias),
			collectionId,
			sources: { [alias]: input },
			sourceIncludes: sourceIncludes2,
			directIncludes: [],
			isUnionFrom: false
		};
	}
	if (from.sources.length === 0) throw new UnsupportedFromTypeError(`empty unionFrom`);
	const sources = {};
	const sourceIncludes = [];
	let pipeline;
	let mainAlias = ``;
	let mainCollectionId = ``;
	for (const source of from.sources) {
		const { alias, input, collectionId, sourceIncludes: childSourceIncludes } = processFrom(source, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, aliasToCollectionId, aliasRemapping, sourceWhereClauses);
		if (!mainAlias) {
			mainAlias = alias;
			mainCollectionId = collectionId;
		}
		sources[alias] = input;
		sourceIncludes.push(...childSourceIncludes);
		const branch = wrapInputWithAlias(input, alias).pipe(map(([key, row]) => {
			return [`${alias}:${encodeKeyForUnionBranch(key)}`, row];
		}));
		pipeline = pipeline ? pipeline.pipe(concat(branch)) : branch;
	}
	return {
		alias: mainAlias,
		pipeline,
		collectionId: mainCollectionId,
		sources,
		sourceIncludes,
		directIncludes: [],
		isUnionFrom: true
	};
}
function processUnionAll(from, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, aliasToCollectionId, aliasRemapping, sourceWhereClauses) {
	if (from.queries.length === 0) throw new UnsupportedFromTypeError(`empty unionAll`);
	const sources = {};
	const sourceIncludes = [];
	const directIncludes = [];
	let pipeline;
	let mainCollectionId = ``;
	const branchAliases = /* @__PURE__ */ new Set();
	for (let index = 0; index < from.queries.length; index++) {
		const branch = from.queries[index];
		for (const source of getAllSources(branch)) {
			if (branchAliases.has(source.alias)) throw new Error(`Duplicate source alias "${source.alias}" in unionAll query branches. Use distinct aliases in each branch before passing them to unionAll().`);
			branchAliases.add(source.alias);
		}
		const branchResult = compileQuery(branch, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping);
		if (!mainCollectionId) mainCollectionId = branchResult.collectionId;
		Object.assign(aliasToCollectionId, branchResult.aliasToCollectionId);
		Object.assign(aliasRemapping, branchResult.aliasRemapping);
		directIncludes.push(...branchResult.includes ?? []);
		Object.assign(sources, allInputs);
		for (const [alias, where] of branchResult.sourceWhereClauses) sourceWhereClauses.set(alias, where);
		const branchPipeline = branchResult.pipeline.pipe(map(([key, [row]]) => {
			return [`${index}:${encodeKeyForUnionBranch(key)}`, row];
		}));
		pipeline = pipeline ? pipeline.pipe(concat(branchPipeline)) : branchPipeline;
	}
	return {
		alias: ``,
		pipeline,
		collectionId: mainCollectionId,
		sources,
		sourceIncludes,
		directIncludes,
		isUnionFrom: true
	};
}
function wrapInputWithAlias(input, alias) {
	return input.pipe(map(([key, row]) => {
		const { __parentContext, ...cleanRow } = row;
		const nsRow = { [alias]: cleanRow };
		if (__parentContext) {
			Object.assign(nsRow, __parentContext);
			nsRow.__parentContext = __parentContext;
		}
		return [key, nsRow];
	}));
}
function encodeKeyForUnionBranch(key) {
	if (typeof key === `string`) return `string:${key}`;
	if (typeof key === `number`) return `number:${String(key)}`;
	if (typeof key === `bigint`) return `bigint:${String(key)}`;
	return `${typeof key}:${JSON.stringify(key)}`;
}
function processFrom(from, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping, aliasToCollectionId, aliasRemapping, sourceWhereClauses) {
	switch (from.type) {
		case `collectionRef`: {
			const input = allInputs[from.alias];
			if (!input) throw new CollectionInputNotFoundError(from.alias, from.collection.id, Object.keys(allInputs));
			aliasToCollectionId[from.alias] = from.collection.id;
			return {
				alias: from.alias,
				input,
				collectionId: from.collection.id,
				sourceIncludes: []
			};
		}
		case `queryRef`: {
			const subQueryResult = compileQuery(queryMapping.get(from.query) || from.query, allInputs, collections, subscriptions, callbacks, lazySources, optimizableOrderByCollections, setWindowFn, cache, queryMapping);
			Object.assign(aliasToCollectionId, subQueryResult.aliasToCollectionId);
			Object.assign(aliasRemapping, subQueryResult.aliasRemapping);
			const isUserDefinedSubquery = queryMapping.has(from.query);
			const subqueryFromAlias = getFirstFromAlias(from.query.from);
			if (!(!isUserDefinedSubquery && from.alias === subqueryFromAlias)) for (const [alias, whereClause] of subQueryResult.sourceWhereClauses) sourceWhereClauses.set(alias, whereClause);
			const innerAlias = Object.keys(subQueryResult.aliasToCollectionId).find((alias) => subQueryResult.aliasToCollectionId[alias] === subQueryResult.collectionId);
			if (innerAlias && innerAlias !== from.alias) aliasRemapping[from.alias] = innerAlias;
			const extractedInput = subQueryResult.pipeline.pipe(map((data) => {
				const [key, [value, _orderByIndex]] = data;
				return [key, unwrapValue(value)];
			}));
			return {
				alias: from.alias,
				input: extractedInput,
				collectionId: subQueryResult.collectionId,
				sourceIncludes: subQueryResult.includes?.map((include) => ({
					sourceAlias: from.alias,
					include
				})) ?? []
			};
		}
		default: throw new UnsupportedFromTypeError(from.type);
	}
}
function isValue(raw) {
	return raw instanceof Value || raw && typeof raw === `object` && `type` in raw && raw.type === `val`;
}
function unwrapValue(value) {
	return isValue(value) ? value.value : value;
}
function attachVirtualPropsToSelected(selected, row) {
	if (!selected || typeof selected !== `object`) return selected;
	let needsMerge = false;
	for (const prop of VIRTUAL_PROP_NAMES) if (selected[prop] == null && prop in row) {
		needsMerge = true;
		break;
	}
	if (!needsMerge) return selected;
	for (const prop of VIRTUAL_PROP_NAMES) if (selected[prop] == null && prop in row) selected[prop] = row[prop];
	return selected;
}
function mapNestedQueries(optimizedQuery, originalQuery, queryMapping) {
	mapNestedFromQueries(optimizedQuery.from, originalQuery.from, queryMapping);
	if (optimizedQuery.join && originalQuery.join) for (let i = 0; i < optimizedQuery.join.length && i < originalQuery.join.length; i++) {
		const optimizedJoin = optimizedQuery.join[i];
		const originalJoin = originalQuery.join[i];
		if (optimizedJoin.from.type === `queryRef` && originalJoin.from.type === `queryRef`) {
			queryMapping.set(optimizedJoin.from.query, originalJoin.from.query);
			mapNestedQueries(optimizedJoin.from.query, originalJoin.from.query, queryMapping);
		}
	}
}
function getFromSources(from) {
	if (from.type === `unionFrom`) return from.sources;
	if (from.type === `unionAll`) return [];
	return [from];
}
function getAllSources(query) {
	return [...getFromSources(query.from), ...query.join?.map((join2) => join2.from) ?? []];
}
function getFirstFromAlias(from) {
	return getFromSources(from)[0]?.alias ?? ``;
}
function findProjectedSourceIncludePaths(select, sourceAlias, sourcePath) {
	return findProjectedIncludePaths(select, [sourceAlias, ...sourcePath]);
}
function findProjectedResultIncludePaths(select, resultPath) {
	return findProjectedIncludePaths(select, resultPath);
}
function findProjectedIncludePaths(select, targetPath) {
	const resultPaths = [];
	const visitSelectObject = (obj, prefix, guards) => {
		for (const [key, value] of Object.entries(obj)) {
			if (key.startsWith(`__SPREAD_SENTINEL__`)) {
				visitSpreadSentinel(key, value, prefix, guards);
				continue;
			}
			visitSelectValue(value, [...prefix, key], guards);
		}
	};
	const visitSpreadSentinel = (key, value, path, guards) => {
		const rest = key.slice(`__SPREAD_SENTINEL__`.length);
		const splitIndex = rest.lastIndexOf(`__`);
		const pathStr = splitIndex >= 0 ? rest.slice(0, splitIndex) : rest;
		const sourcePath = value && typeof value === `object` && `type` in value && value.type === `ref` ? value.path : pathStr.split(`.`).filter(Boolean);
		if (pathStartsWith(targetPath, sourcePath)) resultPaths.push({
			path: [...path, ...targetPath.slice(sourcePath.length)],
			guards
		});
	};
	const visitSelectValue = (value, path, guards) => {
		if (value instanceof PropRef && pathStartsWith(targetPath, value.path)) {
			resultPaths.push({
				path: [...path, ...targetPath.slice(value.path.length)],
				guards
			});
			return;
		}
		if (value instanceof ConditionalSelect) {
			const previousBranchGuards = [];
			for (const branch of value.branches) {
				visitSelectValue(branch.value, path, [
					...guards,
					...previousBranchGuards,
					{
						condition: branch.condition,
						expected: true
					}
				]);
				previousBranchGuards.push({
					condition: branch.condition,
					expected: false
				});
			}
			if (value.defaultValue !== void 0) visitSelectValue(value.defaultValue, path, [...guards, ...previousBranchGuards]);
			return;
		}
		if (isNestedSelectObject$1(value)) visitSelectObject(value, path, guards);
	};
	visitSelectObject(select, [], []);
	return resultPaths;
}
function pathStartsWith(path, prefix) {
	return prefix.length <= path.length && prefix.every((part, i) => path[i] === part);
}
function mapNestedFromQueries(optimizedFrom, originalFrom, queryMapping) {
	if (optimizedFrom.type === `unionAll` && originalFrom.type === `unionAll`) {
		for (let i = 0; i < optimizedFrom.queries.length && i < originalFrom.queries.length; i++) {
			const optimizedBranch = optimizedFrom.queries[i];
			const originalBranch = originalFrom.queries[i];
			queryMapping.set(optimizedBranch, originalBranch);
			mapNestedQueries(optimizedBranch, originalBranch, queryMapping);
		}
		return;
	}
	const optimizedSources = getFromSources(optimizedFrom);
	const originalSources = getFromSources(originalFrom);
	for (let i = 0; i < optimizedSources.length && i < originalSources.length; i++) {
		const optimizedSource = optimizedSources[i];
		const originalSource = originalSources[i];
		if (optimizedSource.type === `queryRef` && originalSource.type === `queryRef`) {
			queryMapping.set(optimizedSource.query, originalSource.query);
			mapNestedQueries(optimizedSource.query, originalSource.query, queryMapping);
		}
	}
}
function extractIncludesFromSelect(select) {
	const results = [];
	for (const [key, value] of Object.entries(select)) {
		if (key.startsWith(`__SPREAD_SENTINEL__`)) continue;
		if (value instanceof IncludesSubquery) results.push({
			key: getIncludesRoutingKey([key], results),
			path: [key],
			subquery: value,
			guards: []
		});
		else if (value instanceof ConditionalSelect) collectIncludesFromConditionalSelect(value, [key], [], results);
		else if (isNestedSelectObject$1(value)) assertNoNestedIncludes(value, key);
	}
	return results;
}
function collectIncludesFromConditionalSelect(conditional, prefixPath, guards, results) {
	const previousBranchGuards = [];
	for (const branch of conditional.branches) {
		collectIncludesFromSelectValue(branch.value, prefixPath, [
			...guards,
			...previousBranchGuards,
			{
				condition: branch.condition,
				expected: true
			}
		], results);
		previousBranchGuards.push({
			condition: branch.condition,
			expected: false
		});
	}
	if (conditional.defaultValue !== void 0) collectIncludesFromSelectValue(conditional.defaultValue, prefixPath, [...guards, ...previousBranchGuards], results);
}
function collectIncludesFromSelectValue(value, prefixPath, guards, results) {
	if (value instanceof IncludesSubquery) {
		const key = getIncludesRoutingKey(prefixPath, results);
		results.push({
			key,
			path: prefixPath,
			subquery: value,
			guards
		});
		return;
	}
	if (value instanceof ConditionalSelect) {
		collectIncludesFromConditionalSelect(value, prefixPath, guards, results);
		return;
	}
	if (!isNestedSelectObject$1(value)) return;
	for (const [key, child] of Object.entries(value)) {
		if (key.startsWith(`__SPREAD_SENTINEL__`)) continue;
		collectIncludesFromSelectValue(child, [...prefixPath, key], guards, results);
	}
}
function getIncludesRoutingKey(path, entries) {
	return getUniqueIncludesRoutingKey(path.join(`.`), entries);
}
function getUniqueIncludesRoutingKey(baseKey, entries) {
	const hasKey = (key2) => entries.some((entry) => (entry.key ?? entry.fieldName) === key2);
	if (!hasKey(baseKey)) return baseKey;
	let suffix = entries.length;
	let key = `${baseKey}#${suffix}`;
	while (hasKey(key)) {
		suffix++;
		key = `${baseKey}#${suffix}`;
	}
	return key;
}
function isNestedSelectObject$1(value) {
	return value != null && typeof value === `object` && !Array.isArray(value) && !isExpressionLike(value);
}
function assertNoNestedIncludes(obj, parentPath) {
	for (const [key, value] of Object.entries(obj)) {
		if (key.startsWith(`__SPREAD_SENTINEL__`)) continue;
		if (value instanceof IncludesSubquery) throw new Error(`Includes subqueries must be at the top level of select(). Found nested includes at "${parentPath}.${key}".`);
		if (isNestedSelectObject$1(value)) assertNoNestedIncludes(value, `${parentPath}.${key}`);
	}
}
function replaceIncludesInSelect(select, path) {
	return replaceIncludesInSelectValue(select, path, new Value(null)).value;
}
function replaceIncludesInSelectValue(value, path, replacement) {
	if (path.length === 0) return replaceIncludesValue(value, replacement);
	if (value instanceof ConditionalSelect) return replaceIncludesInConditionalSelect(value, path, replacement);
	if (!isNestedSelectObject$1(value)) return {
		value,
		replaced: false
	};
	if (path.length === 1) {
		const field = path[0];
		const result2 = replaceIncludesValue(value[field], replacement);
		if (!result2.replaced) return {
			value,
			replaced: false
		};
		return {
			value: {
				...value,
				[field]: result2.value
			},
			replaced: true
		};
	}
	const [head, ...rest] = path;
	const result = replaceIncludesInSelectValue(value[head], rest, replacement);
	if (!result.replaced) return {
		value,
		replaced: false
	};
	return {
		value: {
			...value,
			[head]: result.value
		},
		replaced: true
	};
}
function replaceIncludesValue(value, replacement) {
	if (value instanceof IncludesSubquery) return {
		value: replacement,
		replaced: true
	};
	if (value instanceof ConditionalSelect) return replaceIncludesInConditionalSelect(value, [], replacement);
	return {
		value,
		replaced: false
	};
}
function replaceIncludesInConditionalSelect(conditional, path, replacement) {
	let replaced = false;
	const branches = conditional.branches.map((branch) => {
		const result = path.length === 0 ? replaceIncludesValue(branch.value, replacement) : replaceIncludesInSelectValue(branch.value, path, replacement);
		if (!result.replaced) return branch;
		replaced = true;
		return {
			...branch,
			value: result.value
		};
	});
	let defaultValue = conditional.defaultValue;
	if (conditional.defaultValue !== void 0) {
		const result = path.length === 0 ? replaceIncludesValue(conditional.defaultValue, replacement) : replaceIncludesInSelectValue(conditional.defaultValue, path, replacement);
		if (result.replaced) {
			replaced = true;
			defaultValue = result.value;
		}
	}
	if (!replaced) return {
		value: conditional,
		replaced: false
	};
	return {
		value: new ConditionalSelect(branches, defaultValue),
		replaced: true
	};
}
function getNestedValue(obj, path) {
	let value = obj;
	for (const segment of path) {
		if (value == null) return value;
		value = value[segment];
	}
	return value;
}
function matchesConditionalSelectGuards(guards, row) {
	return guards.every((guard) => isCaseWhenConditionTrue(guard.condition(row)) === guard.expected);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/compiler/expressions.js
function normalizeExpressionPaths(whereClause, collectionAlias) {
	const tpe = whereClause.type;
	if (tpe === `val`) return new Value(whereClause.value);
	else if (tpe === `ref`) {
		const path = whereClause.path;
		if (Array.isArray(path)) {
			if (path[0] === collectionAlias && path.length > 1) return new PropRef(path.slice(1));
			else if (path.length === 1 && path[0] !== void 0) return new PropRef([path[0]]);
		}
		return new PropRef(Array.isArray(path) ? path : [String(path)]);
	} else {
		const args = [];
		for (const arg of whereClause.args) {
			const convertedArg = normalizeExpressionPaths(arg, collectionAlias);
			args.push(convertedArg);
		}
		return new Func(whereClause.name, args);
	}
}
function normalizeOrderByPaths(orderBy, collectionAlias) {
	return orderBy.map((clause) => {
		const basicExp = normalizeExpressionPaths(clause.expression, collectionAlias);
		return {
			...clause,
			expression: basicExp
		};
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/live/collection-registry.js
var collectionBuilderRegistry = /* @__PURE__ */ new WeakMap();
function getBuilderFromConfig(config) {
	return config.utils?.[LIVE_QUERY_INTERNAL]?.getBuilder?.();
}
function registerCollectionBuilder(collection, builder) {
	collectionBuilderRegistry.set(collection, builder);
}
function getCollectionBuilder(collection) {
	return collectionBuilderRegistry.get(collection);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/builder/index.js
var UNION_ALL_SOURCE_CONTEXT = `unionAll clause`;
var BaseQueryBuilder = class BaseQueryBuilder {
	constructor(query = {}) {
		this.query = {};
		this.query = { ...query };
	}
	/**
	* Creates a CollectionRef or QueryRef from a source object
	* @param source - An object with a single key-value pair
	* @param context - Context string for error messages (e.g., "from clause", "join clause")
	* @returns A tuple of [alias, ref] where alias is the source key and ref is the created reference
	*/
	_createRefForSource(source, context) {
		const refs = this._createRefsForSource(source, context);
		if (refs.length !== 1) throw new OnlyOneSourceAllowedError(context);
		return refs[0];
	}
	_createRefsForSource(source, context) {
		if (typeof source === `string`) throw new InvalidSourceTypeError(context, `string`);
		let keys;
		try {
			keys = Object.keys(source);
		} catch {
			throw new InvalidSourceTypeError(context, source === null ? `null` : `undefined`);
		}
		if (Array.isArray(source)) throw new InvalidSourceTypeError(context, `array`);
		if (keys.length === 0) throw new InvalidSourceTypeError(context, `empty object`);
		if (context !== UNION_ALL_SOURCE_CONTEXT && keys.length !== 1) throw new OnlyOneSourceAllowedError(context);
		const refs = [];
		for (const alias of keys) {
			const sourceValue = source[alias];
			let ref;
			if (sourceValue instanceof CollectionImpl) ref = new CollectionRef(sourceValue, alias);
			else if (sourceValue instanceof BaseQueryBuilder) {
				const subQuery = sourceValue._getQuery();
				if (!subQuery.from) throw new SubQueryMustHaveFromClauseError(context);
				ref = new QueryRef(subQuery, alias);
			} else throw new InvalidSourceError(alias);
			refs.push([alias, ref]);
		}
		return refs;
	}
	/**
	* Specify the source table or subquery for the query
	*
	* @param source - An object with a single key-value pair where the key is the table alias and the value is a Collection or subquery
	* @returns A QueryBuilder with the specified source
	*
	* @example
	* ```ts
	* // Query from a collection
	* query.from({ users: usersCollection })
	*
	* // Query from a subquery
	* const activeUsers = query.from({ u: usersCollection }).where(({u}) => u.active)
	* query.from({ activeUsers })
	* ```
	*/
	from(source) {
		const [, from] = this._createRefForSource(source, `from clause`);
		return new BaseQueryBuilder({
			...this.query,
			from
		});
	}
	unionAll(sourceOrBranch, ...branches) {
		if (sourceOrBranch instanceof BaseQueryBuilder) return new BaseQueryBuilder({
			...this.query,
			from: new UnionAll([sourceOrBranch, ...branches].map((branch) => branch._getQuery()))
		});
		const refs = this._createRefsForSource(sourceOrBranch, UNION_ALL_SOURCE_CONTEXT);
		const from = refs.length === 1 ? refs[0][1] : new UnionFrom(refs.map((r) => r[1]));
		return new BaseQueryBuilder({
			...this.query,
			from
		});
	}
	/**
	* Join another table or subquery to the current query
	*
	* @param source - An object with a single key-value pair where the key is the table alias and the value is a Collection or subquery
	* @param onCallback - A function that receives table references and returns the join condition
	* @param type - The type of join: 'inner', 'left', 'right', or 'full' (defaults to 'left')
	* @returns A QueryBuilder with the joined table available
	*
	* @example
	* ```ts
	* // Left join users with posts
	* query
	*   .from({ users: usersCollection })
	*   .join({ posts: postsCollection }, ({users, posts}) => eq(users.id, posts.userId))
	*
	* // Inner join with explicit type
	* query
	*   .from({ u: usersCollection })
	*   .join({ p: postsCollection }, ({u, p}) => eq(u.id, p.userId), 'inner')
	* ```
	*
	* // Join with a subquery
	* const activeUsers = query.from({ u: usersCollection }).where(({u}) => u.active)
	* query
	*   .from({ activeUsers })
	*   .join({ p: postsCollection }, ({u, p}) => eq(u.id, p.userId))
	*/
	join(source, onCallback, type = `left`) {
		const [alias, from] = this._createRefForSource(source, `join clause`);
		const onExpression = onCallback(createRefProxy([...this._getCurrentAliases(), alias]));
		let left;
		let right;
		if (onExpression.type === `func` && onExpression.name === `eq` && onExpression.args.length === 2) {
			left = onExpression.args[0];
			right = onExpression.args[1];
		} else throw new JoinConditionMustBeEqualityError();
		const joinClause = {
			from,
			type,
			left,
			right
		};
		const existingJoins = this.query.join || [];
		return new BaseQueryBuilder({
			...this.query,
			join: [...existingJoins, joinClause]
		});
	}
	/**
	* Perform a LEFT JOIN with another table or subquery
	*
	* @param source - An object with a single key-value pair where the key is the table alias and the value is a Collection or subquery
	* @param onCallback - A function that receives table references and returns the join condition
	* @returns A QueryBuilder with the left joined table available
	*
	* @example
	* ```ts
	* // Left join users with posts
	* query
	*   .from({ users: usersCollection })
	*   .leftJoin({ posts: postsCollection }, ({users, posts}) => eq(users.id, posts.userId))
	* ```
	*/
	leftJoin(source, onCallback) {
		return this.join(source, onCallback, `left`);
	}
	/**
	* Perform a RIGHT JOIN with another table or subquery
	*
	* @param source - An object with a single key-value pair where the key is the table alias and the value is a Collection or subquery
	* @param onCallback - A function that receives table references and returns the join condition
	* @returns A QueryBuilder with the right joined table available
	*
	* @example
	* ```ts
	* // Right join users with posts
	* query
	*   .from({ users: usersCollection })
	*   .rightJoin({ posts: postsCollection }, ({users, posts}) => eq(users.id, posts.userId))
	* ```
	*/
	rightJoin(source, onCallback) {
		return this.join(source, onCallback, `right`);
	}
	/**
	* Perform an INNER JOIN with another table or subquery
	*
	* @param source - An object with a single key-value pair where the key is the table alias and the value is a Collection or subquery
	* @param onCallback - A function that receives table references and returns the join condition
	* @returns A QueryBuilder with the inner joined table available
	*
	* @example
	* ```ts
	* // Inner join users with posts
	* query
	*   .from({ users: usersCollection })
	*   .innerJoin({ posts: postsCollection }, ({users, posts}) => eq(users.id, posts.userId))
	* ```
	*/
	innerJoin(source, onCallback) {
		return this.join(source, onCallback, `inner`);
	}
	/**
	* Perform a FULL JOIN with another table or subquery
	*
	* @param source - An object with a single key-value pair where the key is the table alias and the value is a Collection or subquery
	* @param onCallback - A function that receives table references and returns the join condition
	* @returns A QueryBuilder with the full joined table available
	*
	* @example
	* ```ts
	* // Full join users with posts
	* query
	*   .from({ users: usersCollection })
	*   .fullJoin({ posts: postsCollection }, ({users, posts}) => eq(users.id, posts.userId))
	* ```
	*/
	fullJoin(source, onCallback) {
		return this.join(source, onCallback, `full`);
	}
	/**
	* Filter rows based on a condition
	*
	* @param callback - A function that receives table references and returns an expression
	* @returns A QueryBuilder with the where condition applied
	*
	* @example
	* ```ts
	* // Simple condition
	* query
	*   .from({ users: usersCollection })
	*   .where(({users}) => gt(users.age, 18))
	*
	* // Multiple conditions
	* query
	*   .from({ users: usersCollection })
	*   .where(({users}) => and(
	*     gt(users.age, 18),
	*     eq(users.active, true)
	*   ))
	*
	* // Multiple where calls are ANDed together
	* query
	*   .from({ users: usersCollection })
	*   .where(({users}) => gt(users.age, 18))
	*   .where(({users}) => eq(users.active, true))
	* ```
	*/
	where(callback) {
		const rawExpression = callback(createRefProxy(this._getCurrentAliases()));
		const expression = isRefProxy(rawExpression) ? toExpression(rawExpression) : rawExpression;
		if (!isExpressionLike(expression)) throw new InvalidWhereExpressionError(getValueTypeName(expression));
		const existingWhere = this.query.where || [];
		return new BaseQueryBuilder({
			...this.query,
			where: [...existingWhere, expression]
		});
	}
	/**
	* Filter grouped rows based on aggregate conditions
	*
	* @param callback - A function that receives table references and returns an expression
	* @returns A QueryBuilder with the having condition applied
	*
	* @example
	* ```ts
	* // Filter groups by count
	* query
	*   .from({ posts: postsCollection })
	*   .groupBy(({posts}) => posts.userId)
	*   .having(({posts}) => gt(count(posts.id), 5))
	*
	* // Filter by average
	* query
	*   .from({ orders: ordersCollection })
	*   .groupBy(({orders}) => orders.customerId)
	*   .having(({orders}) => gt(avg(orders.total), 100))
	*
	* // Multiple having calls are ANDed together
	* query
	*   .from({ orders: ordersCollection })
	*   .groupBy(({orders}) => orders.customerId)
	*   .having(({orders}) => gt(count(orders.id), 5))
	*   .having(({orders}) => gt(avg(orders.total), 100))
	* ```
	*/
	having(callback) {
		const aliases = this._getCurrentAliases();
		const rawExpression = callback(this.query.select || this.query.fnSelect ? createRefProxyWithSelected(aliases) : createRefProxy(aliases));
		const expression = isRefProxy(rawExpression) ? toExpression(rawExpression) : rawExpression;
		if (!isExpressionLike(expression)) throw new InvalidWhereExpressionError(getValueTypeName(expression));
		const existingHaving = this.query.having || [];
		return new BaseQueryBuilder({
			...this.query,
			having: [...existingHaving, expression]
		});
	}
	select(callback) {
		const aliases = this._getCurrentAliases();
		let selectObject = callback(createRefProxy(aliases));
		if (isRefProxy(selectObject) && selectObject.__path.length === 1) selectObject = { [`__SPREAD_SENTINEL__${selectObject.__path[0]}__0`]: true };
		const select = buildNestedSelect(selectObject, aliases);
		return new BaseQueryBuilder({
			...this.query,
			select,
			fnSelect: void 0
		});
	}
	/**
	* Sort the query results by one or more columns
	*
	* @param callback - A function that receives table references and returns the field to sort by
	* @param direction - Sort direction: 'asc' for ascending, 'desc' for descending (defaults to 'asc')
	* @returns A QueryBuilder with the ordering applied
	*
	* @example
	* ```ts
	* // Sort by a single column
	* query
	*   .from({ users: usersCollection })
	*   .orderBy(({users}) => users.name)
	*
	* // Sort descending
	* query
	*   .from({ users: usersCollection })
	*   .orderBy(({users}) => users.createdAt, 'desc')
	*
	* // Multiple sorts (chain orderBy calls)
	* query
	*   .from({ users: usersCollection })
	*   .orderBy(({users}) => users.lastName)
	*   .orderBy(({users}) => users.firstName)
	* ```
	*/
	orderBy(callback, options = `asc`) {
		const aliases = this._getCurrentAliases();
		const result = callback(this.query.select || this.query.fnSelect ? createRefProxyWithSelected(aliases) : createRefProxy(aliases));
		const opts = typeof options === `string` ? {
			direction: options,
			nulls: `first`
		} : {
			direction: options.direction ?? `asc`,
			nulls: options.nulls ?? `first`,
			stringSort: options.stringSort,
			locale: options.stringSort === `locale` ? options.locale : void 0,
			localeOptions: options.stringSort === `locale` ? options.localeOptions : void 0
		};
		const makeOrderByClause = (res) => {
			return {
				expression: toExpression(res),
				compareOptions: opts
			};
		};
		const orderByClauses = Array.isArray(result) ? result.map((r) => makeOrderByClause(r)) : [makeOrderByClause(result)];
		const existingOrderBy = this.query.orderBy || [];
		return new BaseQueryBuilder({
			...this.query,
			orderBy: [...existingOrderBy, ...orderByClauses]
		});
	}
	/**
	* Group rows by one or more columns for aggregation
	*
	* @param callback - A function that receives table references and returns the field(s) to group by
	* @returns A QueryBuilder with grouping applied (enables aggregate functions in SELECT and HAVING)
	*
	* @example
	* ```ts
	* // Group by a single column
	* query
	*   .from({ posts: postsCollection })
	*   .groupBy(({posts}) => posts.userId)
	*   .select(({posts, count}) => ({
	*     userId: posts.userId,
	*     postCount: count()
	*   }))
	*
	* // Group by multiple columns
	* query
	*   .from({ sales: salesCollection })
	*   .groupBy(({sales}) => [sales.region, sales.category])
	*   .select(({sales, sum}) => ({
	*     region: sales.region,
	*     category: sales.category,
	*     totalSales: sum(sales.amount)
	*   }))
	* ```
	*/
	groupBy(callback) {
		const result = callback(createRefProxy(this._getCurrentAliases()));
		const newExpressions = Array.isArray(result) ? result.map((r) => toExpression(r)) : [toExpression(result)];
		const existingGroupBy = this.query.groupBy || [];
		return new BaseQueryBuilder({
			...this.query,
			groupBy: [...existingGroupBy, ...newExpressions]
		});
	}
	/**
	* Limit the number of rows returned by the query
	* `orderBy` is required for `limit`
	*
	* @param count - Maximum number of rows to return
	* @returns A QueryBuilder with the limit applied
	*
	* @example
	* ```ts
	* // Get top 5 posts by likes
	* query
	*   .from({ posts: postsCollection })
	*   .orderBy(({posts}) => posts.likes, 'desc')
	*   .limit(5)
	* ```
	*/
	limit(count) {
		return new BaseQueryBuilder({
			...this.query,
			limit: count
		});
	}
	/**
	* Skip a number of rows before returning results
	* `orderBy` is required for `offset`
	*
	* @param count - Number of rows to skip
	* @returns A QueryBuilder with the offset applied
	*
	* @example
	* ```ts
	* // Get second page of results
	* query
	*   .from({ posts: postsCollection })
	*   .orderBy(({posts}) => posts.createdAt, 'desc')
	*   .offset(page * pageSize)
	*   .limit(pageSize)
	* ```
	*/
	offset(count) {
		return new BaseQueryBuilder({
			...this.query,
			offset: count
		});
	}
	/**
	* Specify that the query should return distinct rows.
	* Deduplicates rows based on the selected columns.
	* @returns A QueryBuilder with distinct enabled
	*
	* @example
	* ```ts
	* // Get countries our users are from
	* query
	*   .from({ users: usersCollection })
	*   .select(({users}) => ({ country: users.country }))
	*   .distinct()
	* ```
	*/
	distinct() {
		return new BaseQueryBuilder({
			...this.query,
			distinct: true
		});
	}
	/**
	* Specify that the query should return a single result
	* @returns A QueryBuilder that returns the first result
	*
	* @example
	* ```ts
	* // Get the user matching the query
	* query
	*   .from({ users: usersCollection })
	*   .where(({users}) => eq(users.id, 1))
	*   .findOne()
	*```
	*/
	findOne() {
		return new BaseQueryBuilder({
			...this.query,
			singleResult: true
		});
	}
	_getCurrentAliases() {
		const aliases = [];
		if (this.query.from) if (this.query.from.type === `unionFrom`) aliases.push(...this.query.from.sources.map((source) => source.alias));
		else if (this.query.from.type === `unionAll`) aliases.push(`*`);
		else aliases.push(this.query.from.alias);
		if (this.query.join) for (const join of this.query.join) aliases.push(join.from.alias);
		return aliases;
	}
	/**
	* Functional variants of the query builder
	* These are imperative function that are called for ery row.
	* Warning: that these cannot be optimized by the query compiler, and may prevent
	* some type of optimizations being possible.
	* @example
	* ```ts
	* q.fn.select((row) => ({
	*   name: row.user.name.toUpperCase(),
	*   age: row.user.age + 1,
	* }))
	* ```
	*/
	get fn() {
		const builder = this;
		return {
			/**
			* Select fields using a function that operates on each row
			* Warning: This cannot be optimized by the query compiler
			*
			* @param callback - A function that receives a row and returns the selected value
			* @returns A QueryBuilder with functional selection applied
			*
			* @example
			* ```ts
			* // Functional select (not optimized)
			* query
			*   .from({ users: usersCollection })
			*   .fn.select(row => ({
			*     name: row.users.name.toUpperCase(),
			*     age: row.users.age + 1,
			*   }))
			* ```
			*/
			select(callback) {
				return new BaseQueryBuilder({
					...builder.query,
					select: void 0,
					fnSelect: callback
				});
			},
			/**
			* Filter rows using a function that operates on each row
			* Warning: This cannot be optimized by the query compiler
			*
			* @param callback - A function that receives a row and returns a boolean
			* @returns A QueryBuilder with functional filtering applied
			*
			* @example
			* ```ts
			* // Functional where (not optimized)
			* query
			*   .from({ users: usersCollection })
			*   .fn.where(row => row.users.name.startsWith('A'))
			* ```
			*/
			where(callback) {
				return new BaseQueryBuilder({
					...builder.query,
					fnWhere: [...builder.query.fnWhere || [], callback]
				});
			},
			/**
			* Filter grouped rows using a function that operates on each aggregated row
			* Warning: This cannot be optimized by the query compiler
			*
			* @param callback - A function that receives an aggregated row (with $selected when select() was called) and returns a boolean
			* @returns A QueryBuilder with functional having filter applied
			*
			* @example
			* ```ts
			* // Functional having (not optimized)
			* query
			*   .from({ posts: postsCollection })
			*   .groupBy(({posts}) => posts.userId)
			*   .select(({posts}) => ({ userId: posts.userId, count: count(posts.id) }))
			*   .fn.having(({ $selected }) => $selected.count > 5)
			* ```
			*/
			having(callback) {
				return new BaseQueryBuilder({
					...builder.query,
					fnHaving: [...builder.query.fnHaving || [], callback]
				});
			}
		};
	}
	_getQuery() {
		if (!this.query.from) throw new QueryMustHaveFromClauseError();
		return this.query;
	}
};
function getValueTypeName(value) {
	if (value === null) return `null`;
	if (value === void 0) return `undefined`;
	if (typeof value === `object`) return `object`;
	return typeof value;
}
function toExpr(value) {
	if (value === void 0) return toExpression(null);
	if (value instanceof Aggregate || value instanceof Func || value instanceof PropRef || value instanceof Value) return value;
	return toExpression(value);
}
function isPlainObject(value) {
	return value !== null && typeof value === `object` && !isExpressionLike(value) && !value.__refProxy;
}
function buildNestedSelect(obj, parentAliases = [], fieldName) {
	if (obj instanceof BaseQueryBuilder) {
		if (!fieldName) throw new Error(`Conditional include branch is missing a field name`);
		return buildIncludesSubquery(obj, fieldName, parentAliases, `collection`);
	}
	if (obj instanceof ToArrayWrapper) {
		if (!(obj.query instanceof BaseQueryBuilder)) throw new Error(`toArray() must wrap a subquery builder`);
		if (!fieldName) throw new Error(`Conditional toArray() branch is missing a field name`);
		return buildIncludesSubquery(obj.query, fieldName, parentAliases, `array`);
	}
	if (obj instanceof ConcatToArrayWrapper) {
		if (!(obj.query instanceof BaseQueryBuilder)) throw new Error(`concat(toArray(...)) must wrap a subquery builder`);
		if (!fieldName) throw new Error(`Conditional concat(toArray(...)) branch is missing a field name`);
		return buildIncludesSubquery(obj.query, fieldName, parentAliases, `concat`);
	}
	if (obj instanceof CaseWhenWrapper) return buildConditionalSelect(obj, parentAliases, fieldName);
	if (!isPlainObject(obj)) return toExpr(obj);
	const out = {};
	for (const [k, v] of Object.entries(obj)) {
		if (typeof k === `string` && k.startsWith(`__SPREAD_SENTINEL__`)) {
			out[k] = v;
			continue;
		}
		if (v instanceof BaseQueryBuilder) {
			out[k] = buildIncludesSubquery(v, k, parentAliases, `collection`);
			continue;
		}
		if (v instanceof ToArrayWrapper) {
			if (!(v.query instanceof BaseQueryBuilder)) throw new Error(`toArray() must wrap a subquery builder`);
			out[k] = buildIncludesSubquery(v.query, k, parentAliases, `array`);
			continue;
		}
		if (v instanceof ConcatToArrayWrapper) {
			if (!(v.query instanceof BaseQueryBuilder)) throw new Error(`concat(toArray(...)) must wrap a subquery builder`);
			out[k] = buildIncludesSubquery(v.query, k, parentAliases, `concat`);
			continue;
		}
		if (v instanceof CaseWhenWrapper) {
			out[k] = buildConditionalSelect(v, parentAliases, k);
			continue;
		}
		out[k] = buildNestedSelect(v, parentAliases, k);
	}
	return out;
}
function buildConditionalSelect(wrapper, parentAliases, fieldName) {
	const args = wrapper.args;
	if (args.length < 2) throw new Error(`caseWhen() requires at least two arguments`);
	const hasDefaultValue = args.length % 2 === 1;
	const pairCount = Math.floor(args.length / 2);
	const branches = [];
	for (let i = 0; i < pairCount; i++) branches.push({
		condition: toExpression(args[i * 2]),
		value: buildNestedSelect(args[i * 2 + 1], parentAliases, fieldName)
	});
	return new ConditionalSelect(branches, hasDefaultValue ? buildNestedSelect(args[args.length - 1], parentAliases, fieldName) : void 0);
}
function collectRefsFromExpression(expr) {
	const refs = [];
	switch (expr.type) {
		case `ref`:
			refs.push(expr);
			break;
		case `func`:
			for (const arg of expr.args ?? []) refs.push(...collectRefsFromExpression(arg));
			break;
	}
	return refs;
}
function referencesParent(where, parentAliases) {
	return collectRefsFromExpression(typeof where === `object` && `expression` in where ? where.expression : where).some((ref) => ref.path[0] != null && parentAliases.includes(ref.path[0]));
}
function buildIncludesSubquery(childBuilder, fieldName, parentAliases, materialization) {
	const childQuery = childBuilder._getQuery();
	const childAliases = collectQueryAliases(childQuery);
	let parentRef;
	let childRef;
	let correlationWhereIndex = -1;
	let correlationAndArgIndex = -1;
	if (childQuery.where) for (let i = 0; i < childQuery.where.length; i++) {
		const where = childQuery.where[i];
		const expr = typeof where === `object` && `expression` in where ? where.expression : where;
		if (expr.type === `func` && expr.name === `eq` && expr.args.length === 2) {
			const result = extractCorrelation(expr.args[0], expr.args[1], parentAliases, childAliases);
			if (result) {
				parentRef = result.parentRef;
				childRef = result.childRef;
				correlationWhereIndex = i;
				break;
			}
		}
		if (expr.type === `func` && expr.name === `and` && expr.args.length >= 2) {
			for (let j = 0; j < expr.args.length; j++) {
				const arg = expr.args[j];
				if (arg.type === `func` && arg.name === `eq` && arg.args.length === 2) {
					const result = extractCorrelation(arg.args[0], arg.args[1], parentAliases, childAliases);
					if (result) {
						parentRef = result.parentRef;
						childRef = result.childRef;
						correlationWhereIndex = i;
						correlationAndArgIndex = j;
						break;
					}
				}
			}
			if (parentRef) break;
		}
	}
	if (!parentRef || !childRef || correlationWhereIndex === -1) throw new Error(`Includes subquery for "${fieldName}" must have a WHERE clause with an eq() condition that correlates a parent field with a child field. Example: .where(({child}) => eq(child.parentId, parent.id))`);
	const modifiedWhere = [...childQuery.where];
	if (correlationAndArgIndex >= 0) {
		const where = modifiedWhere[correlationWhereIndex];
		const remainingArgs = (typeof where === `object` && `expression` in where ? where.expression : where).args.filter((_, idx) => idx !== correlationAndArgIndex);
		if (remainingArgs.length === 1) modifiedWhere[correlationWhereIndex] = typeof where === `object` && `expression` in where && where.residual ? {
			expression: remainingArgs[0],
			residual: true
		} : remainingArgs[0];
		else {
			const newAnd = new Func(`and`, remainingArgs);
			modifiedWhere[correlationWhereIndex] = typeof where === `object` && `expression` in where && where.residual ? {
				expression: newAnd,
				residual: true
			} : newAnd;
		}
	} else modifiedWhere.splice(correlationWhereIndex, 1);
	const pureChildWhere = [];
	const parentFilters = [];
	for (const w of modifiedWhere) if (referencesParent(w, parentAliases)) parentFilters.push(w);
	else pureChildWhere.push(w);
	let parentProjection;
	if (parentFilters.length > 0) {
		const seen = /* @__PURE__ */ new Set();
		parentProjection = [];
		for (const w of parentFilters) {
			const expr = typeof w === `object` && `expression` in w ? w.expression : w;
			for (const ref of collectRefsFromExpression(expr)) if (ref.path[0] != null && parentAliases.includes(ref.path[0]) && !seen.has(ref.path.join(`.`))) {
				seen.add(ref.path.join(`.`));
				parentProjection.push(ref);
			}
		}
	}
	const modifiedQuery = {
		...childQuery,
		where: pureChildWhere.length > 0 ? pureChildWhere : void 0
	};
	const rawChildSelect = modifiedQuery.select;
	const hasObjectSelect = rawChildSelect === void 0 || isPlainObject(rawChildSelect);
	let includesQuery = modifiedQuery;
	let scalarField;
	if (materialization === `concat`) {
		if (rawChildSelect === void 0 || hasObjectSelect) throw new Error(`concat(toArray(...)) for "${fieldName}" requires the subquery to select a scalar value`);
	}
	if (!hasObjectSelect) {
		if (materialization === `collection`) throw new Error(`Includes subquery for "${fieldName}" must select an object when materializing as a Collection`);
		scalarField = INCLUDES_SCALAR_FIELD;
		includesQuery = {
			...modifiedQuery,
			select: { [scalarField]: rawChildSelect }
		};
	}
	return new IncludesSubquery(includesQuery, parentRef, childRef, fieldName, parentFilters.length > 0 ? parentFilters : void 0, parentProjection, materialization, scalarField);
}
function collectQueryAliases(query) {
	const aliases = new Set(collectFromAliases(query.from));
	if (query.join) for (const join of query.join) aliases.add(join.from.alias);
	return [...aliases];
}
function collectFromAliases(from) {
	if (from.type === `unionFrom`) return from.sources.map((source) => source.alias);
	if (from.type === `unionAll`) return from.queries.flatMap((branch) => collectQueryAliases(branch));
	return [from.alias];
}
function extractCorrelation(argA, argB, parentAliases, childAliases) {
	if (argA.type === `ref` && argB.type === `ref`) {
		const aAlias = argA.path[0];
		const bAlias = argB.path[0];
		if (aAlias && bAlias && parentAliases.includes(aAlias) && childAliases.includes(bAlias)) return {
			parentRef: argA,
			childRef: argB
		};
		if (aAlias && bAlias && parentAliases.includes(bAlias) && childAliases.includes(aAlias)) return {
			parentRef: argB,
			childRef: argA
		};
	}
}
function buildQuery(fn) {
	return getQueryIR(fn(new BaseQueryBuilder()));
}
function getQueryIR(builder) {
	return builder._getQuery();
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/live/utils.js
function extractCollectionsFromQuery(query) {
	const collections = {};
	function extractFromSource(source) {
		if (source.type === `collectionRef`) collections[source.collection.id] = source.collection;
		else if (source.type === `queryRef`) extractFromQuery(source.query);
		else if (source.type === `unionFrom`) for (const childSource of source.sources) extractFromSource(childSource);
		else if (source.type === `unionAll`) for (const branch of source.queries) extractFromQuery(branch);
	}
	function extractFromQuery(q) {
		if (q.from) extractFromSource(q.from);
		if (q.join && Array.isArray(q.join)) {
			for (const joinClause of q.join) if (joinClause.from) extractFromSource(joinClause.from);
		}
		if (q.select) extractFromSelect(q.select);
	}
	function extractFromSelect(select) {
		for (const [key, value] of Object.entries(select)) {
			if (typeof key === `string` && key.startsWith(`__SPREAD_SENTINEL__`)) continue;
			if (value instanceof IncludesSubquery) extractFromQuery(value.query);
			else if (value instanceof ConditionalSelect) extractFromConditionalSelect(value);
			else if (isNestedSelectObject(value)) extractFromSelect(value);
		}
	}
	function extractFromConditionalSelect(conditional) {
		for (const branch of conditional.branches) extractFromSelectValue(branch.value);
		if (conditional.defaultValue !== void 0) extractFromSelectValue(conditional.defaultValue);
	}
	function extractFromSelectValue(value) {
		if (value instanceof IncludesSubquery) extractFromQuery(value.query);
		else if (value instanceof ConditionalSelect) extractFromConditionalSelect(value);
		else if (isNestedSelectObject(value)) extractFromSelect(value);
	}
	extractFromQuery(query);
	return collections;
}
function extractCollectionFromSource(query) {
	const from = query.from;
	if (from.type === `collectionRef`) return from.collection;
	else if (from.type === `queryRef`) return extractCollectionFromSource(from.query);
	else if (from.type === `unionFrom`) return extractCollectionFromSource({ from: from.sources[0] });
	else if (from.type === `unionAll`) return extractCollectionFromSource(from.queries[0]);
	throw new Error(`Failed to extract collection. Invalid FROM clause: ${JSON.stringify(query)}`);
}
function extractCollectionAliases(query) {
	const aliasesById = /* @__PURE__ */ new Map();
	function recordAlias(source) {
		if (!source) return;
		if (source.type === `collectionRef`) {
			const { id } = source.collection;
			const existing = aliasesById.get(id);
			if (existing) existing.add(source.alias);
			else aliasesById.set(id, /* @__PURE__ */ new Set([source.alias]));
		} else if (source.type === `queryRef`) traverse(source.query);
		else if (source.type === `unionFrom`) for (const childSource of source.sources) recordAlias(childSource);
		else if (source.type === `unionAll`) for (const branch of source.queries) traverse(branch);
	}
	function traverseSelect(select) {
		for (const [key, value] of Object.entries(select)) {
			if (typeof key === `string` && key.startsWith(`__SPREAD_SENTINEL__`)) continue;
			if (value instanceof IncludesSubquery) traverse(value.query);
			else if (value instanceof ConditionalSelect) traverseConditionalSelect(value);
			else if (isNestedSelectObject(value)) traverseSelect(value);
		}
	}
	function traverseConditionalSelect(conditional) {
		for (const branch of conditional.branches) traverseSelectValue(branch.value);
		if (conditional.defaultValue !== void 0) traverseSelectValue(conditional.defaultValue);
	}
	function traverseSelectValue(value) {
		if (value instanceof IncludesSubquery) traverse(value.query);
		else if (value instanceof ConditionalSelect) traverseConditionalSelect(value);
		else if (isNestedSelectObject(value)) traverseSelect(value);
	}
	function traverse(q) {
		if (!q) return;
		recordAlias(q.from);
		if (q.join) for (const joinClause of q.join) recordAlias(joinClause.from);
		if (q.select) traverseSelect(q.select);
	}
	traverse(query);
	return aliasesById;
}
function isNestedSelectObject(obj) {
	if (obj === null || typeof obj !== `object`) return false;
	if (obj instanceof IncludesSubquery) return false;
	if (isExpressionLike(obj)) return false;
	if (obj.__refProxy) return false;
	return true;
}
function buildQueryFromConfig(config) {
	const query = typeof config.query === `function` ? buildQuery(config.query) : getQueryIR(config.query);
	if (config.requireObjectResult && query.select && !isNestedSelectObject(query.select)) throw new UnsupportedRootScalarSelectError();
	return query;
}
function sendChangesToInput(input, changes) {
	const multiSetArray = [];
	for (const change of changes) {
		const key = change.key;
		if (change.type === `insert`) multiSetArray.push([[key, change.value], 1]);
		else if (change.type === `update`) {
			multiSetArray.push([[key, change.previousValue], -1]);
			multiSetArray.push([[key, change.value], 1]);
		} else multiSetArray.push([[key, change.value], -1]);
	}
	if (multiSetArray.length !== 0) input.sendData(new MultiSet(multiSetArray));
	return multiSetArray.length;
}
function* splitUpdates(changes) {
	for (const change of changes) if (change.type === `update`) {
		yield {
			type: `delete`,
			key: change.key,
			value: change.previousValue
		};
		yield {
			type: `insert`,
			key: change.key,
			value: change.value
		};
	} else yield change;
}
function filterDuplicateInserts(changes, sentKeys) {
	const filtered = [];
	for (const change of changes) {
		if (change.type === `insert`) {
			if (sentKeys.has(change.key)) continue;
			sentKeys.add(change.key);
		} else if (change.type === `delete`) sentKeys.delete(change.key);
		filtered.push(change);
	}
	return filtered;
}
function trackBiggestSentValue(changes, current, sentKeys, comparator) {
	let biggest = current;
	let shouldResetLoadKey = false;
	for (const change of changes) {
		if (change.type === `delete`) continue;
		const isNewKey = !sentKeys.has(change.key);
		if (biggest === void 0) {
			biggest = change.value;
			shouldResetLoadKey = true;
		} else if (comparator(biggest, change.value) < 0) {
			biggest = change.value;
			shouldResetLoadKey = true;
		} else if (isNewKey) shouldResetLoadKey = true;
	}
	return {
		biggest,
		shouldResetLoadKey
	};
}
function computeSubscriptionOrderByHints(query, alias) {
	const { orderBy, limit, offset } = query;
	const effectiveLimit = limit !== void 0 && offset !== void 0 ? limit + offset : limit;
	const normalizedOrderBy = orderBy ? normalizeOrderByPaths(orderBy, alias) : void 0;
	const canPassOrderBy = normalizedOrderBy?.every((clause) => {
		const exp = clause.expression;
		if (exp.type !== `ref`) return false;
		const path = exp.path;
		return Array.isArray(path) && path.length === 1;
	}) ?? false;
	return {
		orderBy: canPassOrderBy ? normalizedOrderBy : void 0,
		limit: canPassOrderBy ? effectiveLimit : void 0
	};
}
function computeOrderedLoadCursor(orderByInfo, biggestSentRow, lastLoadRequestKey, alias, limit) {
	const { orderBy, valueExtractorForRawRow, offset } = orderByInfo;
	const extractedValues = biggestSentRow ? valueExtractorForRawRow(biggestSentRow) : void 0;
	let minValues;
	if (extractedValues !== void 0) minValues = Array.isArray(extractedValues) ? extractedValues : [extractedValues];
	const loadRequestKey = serializeValue({
		minValues: minValues ?? null,
		offset,
		limit
	});
	if (lastLoadRequestKey === loadRequestKey) return;
	const normalizedOrderBy = normalizeOrderByPaths(orderBy, alias);
	return {
		minValues,
		normalizedOrderBy,
		loadRequestKey
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/live/collection-subscriber.js
var loadMoreCallbackSymbol = /* @__PURE__ */ Symbol.for(`@tanstack/db.collection-config-builder`);
var CollectionSubscriber = class {
	constructor(alias, collectionId, collection, collectionConfigBuilder) {
		this.alias = alias;
		this.collectionId = collectionId;
		this.collection = collection;
		this.collectionConfigBuilder = collectionConfigBuilder;
		this.biggest = void 0;
		this.subscriptionLoadingPromises = /* @__PURE__ */ new Map();
		this.sentToD2Keys = /* @__PURE__ */ new Set();
	}
	subscribe() {
		const whereClause = this.getWhereClauseForAlias();
		if (whereClause) {
			const whereExpression = normalizeExpressionPaths(whereClause, this.alias);
			return this.subscribeToChanges(whereExpression);
		}
		return this.subscribeToChanges();
	}
	subscribeToChanges(whereExpression) {
		const orderByInfo = this.getOrderByInfo();
		const trackLoadResult = (result) => {
			if (result instanceof Promise) this.collectionConfigBuilder.liveQueryCollection._sync.trackLoadPromise(result);
		};
		const onStatusChange = (event) => {
			const subscription2 = event.subscription;
			if (event.status === `loadingSubset`) this.ensureLoadingPromise(subscription2);
			else {
				const deferred = this.subscriptionLoadingPromises.get(subscription2);
				if (deferred) {
					this.subscriptionLoadingPromises.delete(subscription2);
					deferred.resolve();
				}
			}
		};
		let subscription;
		if (orderByInfo) subscription = this.subscribeToOrderedChanges(whereExpression, orderByInfo, onStatusChange, trackLoadResult);
		else {
			const includeInitialState = !this.collectionConfigBuilder.isLazyAlias(this.alias);
			subscription = this.subscribeToMatchingChanges(whereExpression, includeInitialState, onStatusChange);
		}
		if (subscription.status === `loadingSubset`) this.ensureLoadingPromise(subscription);
		const unsubscribe = () => {
			const deferred = this.subscriptionLoadingPromises.get(subscription);
			if (deferred) {
				this.subscriptionLoadingPromises.delete(subscription);
				deferred.resolve();
			}
			subscription.unsubscribe();
		};
		this.collectionConfigBuilder.currentSyncState.unsubscribeCallbacks.add(unsubscribe);
		return subscription;
	}
	sendChangesToPipeline(changes, callback) {
		const filteredChanges = filterDuplicateInserts(Array.isArray(changes) ? changes : [...changes], this.sentToD2Keys);
		const input = this.collectionConfigBuilder.currentSyncState.inputs[this.alias];
		const dataLoader = sendChangesToInput(input, filteredChanges) > 0 ? callback : void 0;
		this.collectionConfigBuilder.scheduleGraphRun(dataLoader, { alias: this.alias });
	}
	subscribeToMatchingChanges(whereExpression, includeInitialState, onStatusChange) {
		const sendChanges = (changes) => {
			this.sendChangesToPipeline(changes);
		};
		const hints = computeSubscriptionOrderByHints(this.collectionConfigBuilder.query, this.alias);
		const onLoadSubsetResult = includeInitialState ? (result) => {
			if (result instanceof Promise) this.collectionConfigBuilder.liveQueryCollection._sync.trackLoadPromise(result);
		} : void 0;
		return this.collection.subscribeChanges(sendChanges, {
			...includeInitialState && { includeInitialState },
			whereExpression,
			onStatusChange,
			orderBy: hints.orderBy,
			limit: hints.limit,
			onLoadSubsetResult
		});
	}
	subscribeToOrderedChanges(whereExpression, orderByInfo, onStatusChange, onLoadSubsetResult) {
		const { orderBy, offset, limit, index } = orderByInfo;
		const handleLoadSubsetResult = (result) => {
			if (result instanceof Promise) {
				this.pendingOrderedLoadPromise = result;
				result.finally(() => {
					if (this.pendingOrderedLoadPromise === result) this.pendingOrderedLoadPromise = void 0;
				});
			}
			onLoadSubsetResult(result);
		};
		this.orderedLoadSubsetResult = handleLoadSubsetResult;
		const subscriptionHolder = {};
		const sendChangesInRange = (changes) => {
			const changesArray = Array.isArray(changes) ? changes : [...changes];
			this.trackSentValues(changesArray, orderByInfo.comparator);
			const splittedChanges = splitUpdates(changesArray);
			this.sendChangesToPipelineWithTracking(splittedChanges, subscriptionHolder.current);
		};
		const subscription = this.collection.subscribeChanges(sendChangesInRange, {
			whereExpression,
			onStatusChange
		});
		subscriptionHolder.current = subscription;
		const truncateUnsubscribe = this.collection.on(`truncate`, () => {
			this.biggest = void 0;
			this.lastLoadRequestKey = void 0;
			this.pendingOrderedLoadPromise = void 0;
			this.sentToD2Keys.clear();
		});
		subscription.on(`unsubscribed`, () => {
			truncateUnsubscribe();
		});
		const normalizedOrderBy = normalizeOrderByPaths(orderBy, this.alias);
		if (index) {
			subscription.setOrderByIndex(index);
			subscription.requestLimitedSnapshot({
				limit: offset + limit,
				orderBy: normalizedOrderBy,
				trackLoadSubsetPromise: false,
				onLoadSubsetResult: handleLoadSubsetResult
			});
		} else subscription.requestSnapshot({
			orderBy: normalizedOrderBy,
			limit: offset + limit,
			trackLoadSubsetPromise: false,
			onLoadSubsetResult: handleLoadSubsetResult
		});
		return subscription;
	}
	loadMoreIfNeeded(subscription) {
		const orderByInfo = this.getOrderByInfo();
		if (!orderByInfo) return true;
		const { dataNeeded, index } = orderByInfo;
		if (!dataNeeded || !index) return true;
		if (this.pendingOrderedLoadPromise) return true;
		const n = dataNeeded();
		if (n > 0) this.loadNextItems(n, subscription);
		return true;
	}
	sendChangesToPipelineWithTracking(changes, subscription) {
		if (!this.getOrderByInfo()) {
			this.sendChangesToPipeline(changes);
			return;
		}
		const subscriptionWithLoader = subscription;
		subscriptionWithLoader[loadMoreCallbackSymbol] ??= this.loadMoreIfNeeded.bind(this, subscription);
		this.sendChangesToPipeline(changes, subscriptionWithLoader[loadMoreCallbackSymbol]);
	}
	loadNextItems(n, subscription) {
		const orderByInfo = this.getOrderByInfo();
		if (!orderByInfo) return;
		const cursor = computeOrderedLoadCursor(orderByInfo, this.biggest, this.lastLoadRequestKey, this.alias, n);
		if (!cursor) return;
		this.lastLoadRequestKey = cursor.loadRequestKey;
		subscription.requestLimitedSnapshot({
			orderBy: cursor.normalizedOrderBy,
			limit: n,
			minValues: cursor.minValues,
			trackLoadSubsetPromise: false,
			onLoadSubsetResult: this.orderedLoadSubsetResult
		});
	}
	getWhereClauseForAlias() {
		const sourceWhereClausesCache = this.collectionConfigBuilder.sourceWhereClausesCache;
		if (!sourceWhereClausesCache) return;
		return sourceWhereClausesCache.get(this.alias);
	}
	getOrderByInfo() {
		const info = this.collectionConfigBuilder.optimizableOrderByCollections[this.collectionId];
		if (info && info.alias === this.alias) return info;
	}
	trackSentValues(changes, comparator) {
		const result = trackBiggestSentValue(changes, this.biggest, this.sentToD2Keys, comparator);
		this.biggest = result.biggest;
		if (result.shouldResetLoadKey) this.lastLoadRequestKey = void 0;
	}
	ensureLoadingPromise(subscription) {
		if (this.subscriptionLoadingPromises.has(subscription)) return;
		let resolve;
		const promise = new Promise((res) => {
			resolve = res;
		});
		this.subscriptionLoadingPromises.set(subscription, { resolve });
		this.collectionConfigBuilder.liveQueryCollection._sync.trackLoadPromise(promise);
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/live/collection-config-builder.js
var liveQueryCollectionCounter = 0;
var CollectionConfigBuilder = class {
	constructor(config) {
		this.config = config;
		this.compiledAliasToCollectionId = {};
		this.resultKeys = /* @__PURE__ */ new WeakMap();
		this.orderByIndices = /* @__PURE__ */ new WeakMap();
		this.isGraphRunning = false;
		this.runCount = 0;
		this.isInErrorState = false;
		this.aliasDependencies = {};
		this.builderDependencies = /* @__PURE__ */ new Set();
		this.pendingGraphRuns = /* @__PURE__ */ new Map();
		this.subscriptions = {};
		this.lazySourcesCallbacks = {};
		this.lazySources = /* @__PURE__ */ new Set();
		this.optimizableOrderByCollections = {};
		this.id = config.id || `live-query-${++liveQueryCollectionCounter}`;
		this.query = buildQueryFromConfig({
			query: config.query,
			requireObjectResult: true
		});
		this.collections = extractCollectionsFromQuery(this.query);
		const collectionAliasesById = extractCollectionAliases(this.query);
		this.collectionByAlias = {};
		for (const [collectionId, aliases] of collectionAliasesById.entries()) {
			const collection = this.collections[collectionId];
			if (!collection) continue;
			for (const alias of aliases) this.collectionByAlias[alias] = collection;
		}
		if (this.query.orderBy && this.query.orderBy.length > 0) this.compare = createOrderByComparator(this.orderByIndices);
		this.compareOptions = this.config.defaultStringCollation ?? extractCollectionFromSource(this.query).compareOptions;
		this.compileBasePipeline();
	}
	/**
	* Recursively checks if a query or any of its subqueries contains joins
	*/
	hasJoins(query) {
		if (query.join && query.join.length > 0) return true;
		if (query.from.type === `queryRef`) {
			if (this.hasJoins(query.from.query)) return true;
		} else if (query.from.type === `unionFrom`) {
			for (const source of query.from.sources) if (source.type === `queryRef` && this.hasJoins(source.query)) return true;
		} else if (query.from.type === `unionAll`) {
			for (const branch of query.from.queries) if (this.hasJoins(branch)) return true;
		}
		return false;
	}
	getConfig() {
		return {
			id: this.id,
			getKey: this.config.getKey || ((item) => this.resultKeys.get(item) ?? item.$key),
			sync: this.getSyncConfig(),
			compare: this.compare,
			defaultStringCollation: this.compareOptions,
			gcTime: this.config.gcTime || 5e3,
			schema: this.config.schema,
			onInsert: this.config.onInsert,
			onUpdate: this.config.onUpdate,
			onDelete: this.config.onDelete,
			startSync: this.config.startSync,
			singleResult: this.query.singleResult,
			utils: {
				getRunCount: this.getRunCount.bind(this),
				setWindow: this.setWindow.bind(this),
				getWindow: this.getWindow.bind(this),
				[LIVE_QUERY_INTERNAL]: {
					getBuilder: () => this,
					hasCustomGetKey: !!this.config.getKey,
					hasJoins: this.hasJoins(this.query),
					hasDistinct: !!this.query.distinct
				}
			}
		};
	}
	setWindow(options) {
		if (!this.windowFn) throw new SetWindowRequiresOrderByError();
		this.currentWindow = options;
		this.windowFn(options);
		this.maybeRunGraphFn?.();
		if (this.liveQueryCollection?.isLoadingSubset) return new Promise((resolve) => {
			const unsubscribe = this.liveQueryCollection.on(`loadingSubset:change`, (event) => {
				if (!event.isLoadingSubset) {
					unsubscribe();
					resolve();
				}
			});
		});
		return true;
	}
	getWindow() {
		if (!this.windowFn || !this.currentWindow) return;
		return {
			offset: this.currentWindow.offset ?? 0,
			limit: this.currentWindow.limit ?? 0
		};
	}
	/**
	* Resolves a collection alias to its collection ID.
	*
	* Uses a two-tier lookup strategy:
	* 1. First checks compiled aliases (includes subquery inner aliases)
	* 2. Falls back to declared aliases from the query's from/join clauses
	*
	* @param alias - The alias to resolve (e.g., "employee", "manager")
	* @returns The collection ID that the alias references
	* @throws {Error} If the alias is not found in either lookup
	*/
	getCollectionIdForAlias(alias) {
		const compiled = this.compiledAliasToCollectionId[alias];
		if (compiled) return compiled;
		const collection = this.collectionByAlias[alias];
		if (collection) return collection.id;
		throw new Error(`Unknown source alias "${alias}"`);
	}
	isLazyAlias(alias) {
		return this.lazySources.has(alias);
	}
	maybeRunGraph(callback) {
		if (this.isGraphRunning) return;
		if (!this.currentSyncConfig || !this.currentSyncState) throw new Error(`maybeRunGraph called without active sync session. This should not happen.`);
		this.isGraphRunning = true;
		try {
			const { begin, commit } = this.currentSyncConfig;
			const syncState = this.currentSyncState;
			if (this.isInErrorState) return;
			if (syncState.subscribedToAllCollections) {
				let callbackCalled = false;
				while (syncState.graph.pendingWork()) {
					syncState.graph.run();
					syncState.flushPendingChanges?.();
					callback?.();
					callbackCalled = true;
				}
				if (!callbackCalled) callback?.();
				if (syncState.messagesCount === 0) {
					begin();
					commit();
				}
				this.updateLiveQueryStatus(this.currentSyncConfig);
			}
		} finally {
			this.isGraphRunning = false;
		}
	}
	/**
	* Schedules a graph run with the transaction-scoped scheduler.
	* Ensures each builder runs at most once per transaction, with automatic dependency tracking
	* to run parent queries before child queries. Outside a transaction, runs immediately.
	*
	* Multiple calls during a transaction are coalesced into a single execution.
	* Dependencies are auto-discovered from subscribed live queries, or can be overridden.
	* Load callbacks are combined when entries merge.
	*
	* Uses the current sync session's config and syncState from instance properties.
	*
	* @param callback - Optional callback to load more data if needed (returns true when done)
	* @param options - Optional scheduling configuration
	* @param options.contextId - Transaction ID to group work; defaults to active transaction
	* @param options.jobId - Unique identifier for this job; defaults to this builder instance
	* @param options.alias - Source alias that triggered this schedule; adds alias-specific dependencies
	* @param options.dependencies - Explicit dependency list; overrides auto-discovered dependencies
	*/
	scheduleGraphRun(callback, options) {
		const contextId = options?.contextId ?? getActiveTransaction()?.id;
		const jobId = options?.jobId ?? this;
		const dependentBuilders = (() => {
			if (options?.dependencies) return options.dependencies;
			const deps = new Set(this.builderDependencies);
			if (options?.alias) {
				const aliasDeps = this.aliasDependencies[options.alias];
				if (aliasDeps) for (const dep of aliasDeps) deps.add(dep);
			}
			deps.delete(this);
			return Array.from(deps);
		})();
		if (contextId) {
			for (const dep of dependentBuilders) if (typeof dep.scheduleGraphRun === `function`) dep.scheduleGraphRun(void 0, { contextId });
		}
		if (!this.currentSyncConfig || !this.currentSyncState) throw new Error(`scheduleGraphRun called without active sync session. This should not happen.`);
		let pending = contextId ? this.pendingGraphRuns.get(contextId) : void 0;
		if (!pending) {
			pending = { loadCallbacks: /* @__PURE__ */ new Set() };
			if (contextId) this.pendingGraphRuns.set(contextId, pending);
		}
		if (callback) pending.loadCallbacks.add(callback);
		const pendingToPass = contextId ? void 0 : pending;
		transactionScopedScheduler.schedule({
			contextId,
			jobId,
			dependencies: dependentBuilders,
			run: () => this.executeGraphRun(contextId, pendingToPass)
		});
	}
	/**
	* Clears pending graph run state for a specific context.
	* Called when the scheduler clears a context (e.g., transaction rollback/abort).
	*/
	clearPendingGraphRun(contextId) {
		this.pendingGraphRuns.delete(contextId);
	}
	/**
	* Returns true if this builder has a pending graph run for the given context.
	*/
	hasPendingGraphRun(contextId) {
		return this.pendingGraphRuns.has(contextId);
	}
	/**
	* Executes a pending graph run. Called by the scheduler when dependencies are satisfied.
	* Clears the pending state BEFORE execution so that any re-schedules during the run
	* create fresh state and don't interfere with the current execution.
	* Uses instance sync state - if sync has ended, gracefully returns without executing.
	*
	* @param contextId - Optional context ID to look up pending state
	* @param pendingParam - For immediate execution (no context), pending state is passed directly
	*/
	executeGraphRun(contextId, pendingParam) {
		const pending = pendingParam ?? (contextId ? this.pendingGraphRuns.get(contextId) : void 0);
		if (contextId) this.pendingGraphRuns.delete(contextId);
		if (!pending) return;
		if (!this.currentSyncConfig || !this.currentSyncState) return;
		this.incrementRunCount();
		const combinedLoader = () => {
			let allDone = true;
			let firstError;
			pending.loadCallbacks.forEach((loader) => {
				try {
					allDone = loader() && allDone;
				} catch (error) {
					allDone = false;
					firstError ??= error;
				}
			});
			if (firstError) throw firstError;
			return allDone;
		};
		this.maybeRunGraph(combinedLoader);
	}
	getSyncConfig() {
		return {
			rowUpdateMode: `full`,
			sync: this.syncFn.bind(this)
		};
	}
	incrementRunCount() {
		this.runCount++;
	}
	getRunCount() {
		return this.runCount;
	}
	syncFn(config) {
		this.liveQueryCollection = config.collection;
		this.currentSyncConfig = config;
		const syncState = {
			messagesCount: 0,
			subscribedToAllCollections: false,
			unsubscribeCallbacks: /* @__PURE__ */ new Set()
		};
		const fullSyncState = this.extendPipelineWithChangeProcessing(config, syncState);
		this.currentSyncState = fullSyncState;
		this.unsubscribeFromSchedulerClears = transactionScopedScheduler.onClear((contextId) => {
			this.clearPendingGraphRun(contextId);
		});
		const loadingSubsetUnsubscribe = config.collection.on(`loadingSubset:change`, (event) => {
			if (!event.isLoadingSubset) this.updateLiveQueryStatus(config);
		});
		syncState.unsubscribeCallbacks.add(loadingSubsetUnsubscribe);
		const loadSubsetDataCallbacks = this.subscribeToAllCollections(config, fullSyncState);
		this.maybeRunGraphFn = () => this.scheduleGraphRun(loadSubsetDataCallbacks);
		this.scheduleGraphRun(loadSubsetDataCallbacks);
		return () => {
			syncState.unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
			this.currentSyncConfig = void 0;
			this.currentSyncState = void 0;
			this.pendingGraphRuns.clear();
			this.graphCache = void 0;
			this.inputsCache = void 0;
			this.pipelineCache = void 0;
			this.sourceWhereClausesCache = void 0;
			this.includesCache = void 0;
			this.lazySources.clear();
			this.optimizableOrderByCollections = {};
			this.lazySourcesCallbacks = {};
			Object.keys(this.subscriptions).forEach((key) => delete this.subscriptions[key]);
			this.compiledAliasToCollectionId = {};
			this.unsubscribeFromSchedulerClears?.();
			this.unsubscribeFromSchedulerClears = void 0;
		};
	}
	/**
	* Compiles the query pipeline with all declared aliases.
	*/
	compileBasePipeline() {
		this.graphCache = new D2();
		this.inputsCache = Object.fromEntries(Object.keys(this.collectionByAlias).map((alias) => [alias, this.graphCache.newInput()]));
		const compilation = compileQuery(this.query, this.inputsCache, this.collections, this.subscriptions, this.lazySourcesCallbacks, this.lazySources, this.optimizableOrderByCollections, (windowFn) => {
			this.windowFn = windowFn;
		});
		this.pipelineCache = compilation.pipeline;
		this.sourceWhereClausesCache = compilation.sourceWhereClauses;
		this.compiledAliasToCollectionId = compilation.aliasToCollectionId;
		this.includesCache = compilation.includes;
		const missingAliases = Object.keys(this.compiledAliasToCollectionId).filter((alias) => !Object.hasOwn(this.inputsCache, alias));
		if (missingAliases.length > 0) throw new MissingAliasInputsError(missingAliases);
	}
	maybeCompileBasePipeline() {
		if (!this.graphCache || !this.inputsCache || !this.pipelineCache) this.compileBasePipeline();
		return {
			graph: this.graphCache,
			inputs: this.inputsCache,
			pipeline: this.pipelineCache
		};
	}
	extendPipelineWithChangeProcessing(config, syncState) {
		const { begin, commit } = config;
		const { graph, inputs, pipeline } = this.maybeCompileBasePipeline();
		let pendingChanges = /* @__PURE__ */ new Map();
		pipeline.pipe(output((data) => {
			const messages = data.getInner();
			syncState.messagesCount += messages.length;
			messages.reduce(accumulateChanges, pendingChanges);
		}));
		const includesState = this.setupIncludesOutput(this.includesCache, syncState);
		syncState.flushPendingChanges = () => {
			const hasParentChanges = pendingChanges.size > 0;
			const hasChildChanges = hasPendingIncludesChanges(includesState);
			if (!hasParentChanges && !hasChildChanges) return;
			let changesToApply = pendingChanges;
			if (this.config.getKey) {
				const merged = /* @__PURE__ */ new Map();
				for (const [, changes] of pendingChanges) {
					const customKey = this.config.getKey(changes.value);
					const existing = merged.get(customKey);
					if (existing) {
						existing.inserts += changes.inserts;
						existing.deletes += changes.deletes;
						if (changes.inserts > 0) {
							existing.value = changes.value;
							if (changes.orderByIndex !== void 0) existing.orderByIndex = changes.orderByIndex;
						}
					} else merged.set(customKey, { ...changes });
				}
				changesToApply = merged;
			}
			if (hasParentChanges) {
				begin();
				changesToApply.forEach(this.applyChanges.bind(this, config));
				commit();
			}
			pendingChanges = /* @__PURE__ */ new Map();
			flushIncludesState(includesState, config.collection, this.id, hasParentChanges ? changesToApply : null, config);
		};
		graph.finalize();
		syncState.graph = graph;
		syncState.inputs = inputs;
		syncState.pipeline = pipeline;
		return syncState;
	}
	/**
	* Sets up output callbacks for includes child pipelines.
	* Each includes entry gets its own output callback that accumulates child changes,
	* and a child registry that maps correlation key → child Collection.
	*/
	setupIncludesOutput(includesEntries, syncState) {
		if (!includesEntries || includesEntries.length === 0) return [];
		return includesEntries.map((entry) => {
			const state = {
				fieldName: entry.fieldName,
				resultPath: entry.resultPath,
				childCorrelationField: entry.childCorrelationField,
				hasOrderBy: entry.hasOrderBy,
				materialization: entry.materialization,
				scalarField: entry.scalarField,
				childRegistry: /* @__PURE__ */ new Map(),
				pendingChildChanges: /* @__PURE__ */ new Map(),
				correlationToParentKeys: /* @__PURE__ */ new Map()
			};
			entry.pipeline.pipe(output((data) => {
				const messages = data.getInner();
				syncState.messagesCount += messages.length;
				for (const [[childKey, tupleData], multiplicity] of messages) {
					const [childResult, _orderByIndex, correlationKey, parentContext] = tupleData;
					const routingKey = computeRoutingKey(correlationKey, parentContext);
					let byChild = state.pendingChildChanges.get(routingKey);
					if (!byChild) {
						byChild = /* @__PURE__ */ new Map();
						state.pendingChildChanges.set(routingKey, byChild);
					}
					const existing = byChild.get(childKey) || {
						deletes: 0,
						inserts: 0,
						value: childResult,
						orderByIndex: _orderByIndex
					};
					if (multiplicity < 0) existing.deletes += Math.abs(multiplicity);
					else if (multiplicity > 0) {
						existing.inserts += multiplicity;
						existing.value = childResult;
					}
					byChild.set(childKey, existing);
				}
			}));
			if (entry.childCompilationResult.includes) {
				state.nestedSetups = setupNestedPipelines(entry.childCompilationResult.includes, syncState);
				state.nestedRoutingIndex = /* @__PURE__ */ new Map();
				state.nestedRoutingReverseIndex = /* @__PURE__ */ new Map();
			}
			return state;
		});
	}
	applyChanges(config, changes, key) {
		const { write, collection } = config;
		const { deletes, inserts, value, orderByIndex } = changes;
		this.resultKeys.set(value, key);
		if (orderByIndex !== void 0) this.orderByIndices.set(value, orderByIndex);
		if (inserts && deletes === 0) write({
			value,
			type: `insert`
		});
		else if (inserts > deletes || inserts === deletes && collection.has(collection.getKeyFromItem(value))) write({
			value,
			type: `update`
		});
		else if (deletes > 0) write({
			value,
			type: `delete`
		});
		else throw new Error(`Could not apply changes: ${JSON.stringify(changes)}. This should never happen.`);
	}
	/**
	* Handle status changes from source collections
	*/
	handleSourceStatusChange(config, collectionId, event) {
		const { status } = event;
		if (status === `error`) {
			this.transitionToError(`Source collection '${collectionId}' entered error state`);
			return;
		}
		if (status === `cleaned-up`) {
			this.transitionToError(`Source collection '${collectionId}' was manually cleaned up while live query '${this.id}' depends on it. Live queries prevent automatic GC, so this was likely a manual cleanup() call.`);
			return;
		}
		this.updateLiveQueryStatus(config);
	}
	/**
	* Update the live query status based on source collection statuses
	*/
	updateLiveQueryStatus(config) {
		const { markReady } = config;
		if (this.isInErrorState) return;
		const subscribedToAll = this.currentSyncState?.subscribedToAllCollections;
		const allReady = this.allCollectionsReady();
		const isLoading = this.liveQueryCollection?.isLoadingSubset;
		if (subscribedToAll && allReady && !isLoading) markReady();
	}
	/**
	* Transition the live query to error state
	*/
	transitionToError(message) {
		this.isInErrorState = true;
		console.error(`[Live Query Error] ${message}`);
		this.liveQueryCollection?._lifecycle.setStatus(`error`);
	}
	allCollectionsReady() {
		return Object.values(this.collections).every((collection) => collection.isReady());
	}
	/**
	* Creates per-alias subscriptions enabling self-join support.
	* Each alias gets its own subscription with independent filters, even for the same collection.
	* Example: `{ employee: col, manager: col }` creates two separate subscriptions.
	*/
	subscribeToAllCollections(config, syncState) {
		const compiledAliases = Object.entries(this.compiledAliasToCollectionId);
		if (compiledAliases.length === 0) throw new Error(`Compiler returned no alias metadata for query '${this.id}'. This should not happen; please report.`);
		const loaders = compiledAliases.map(([alias, collectionId]) => {
			const collection = this.collectionByAlias[alias] ?? this.collections[collectionId];
			const dependencyBuilder = getCollectionBuilder(collection);
			if (dependencyBuilder && dependencyBuilder !== this) {
				this.aliasDependencies[alias] = [dependencyBuilder];
				this.builderDependencies.add(dependencyBuilder);
			} else this.aliasDependencies[alias] = [];
			const collectionSubscriber = new CollectionSubscriber(alias, collectionId, collection, this);
			const statusUnsubscribe = collection.on(`status:change`, (event) => {
				this.handleSourceStatusChange(config, collectionId, event);
			});
			syncState.unsubscribeCallbacks.add(statusUnsubscribe);
			const subscription = collectionSubscriber.subscribe();
			this.subscriptions[alias] = subscription;
			return collectionSubscriber.loadMoreIfNeeded.bind(collectionSubscriber, subscription);
		});
		const loadSubsetDataCallbacks = () => {
			loaders.map((loader) => loader());
			return true;
		};
		syncState.subscribedToAllCollections = true;
		return loadSubsetDataCallbacks;
	}
};
function createOrderByComparator(orderByIndices) {
	return (val1, val2) => {
		const index1 = orderByIndices.get(val1);
		const index2 = orderByIndices.get(val2);
		if (index1 && index2) if (index1 < index2) return -1;
		else if (index1 > index2) return 1;
		else return 0;
		return 0;
	};
}
function materializesInline(state) {
	return state.materialization !== `collection`;
}
function materializeIncludedValue(state, entry) {
	if (!entry) {
		if (state.materialization === `array`) return [];
		if (state.materialization === `concat`) return ``;
		return;
	}
	if (state.materialization === `collection`) return entry.collection;
	const rows = [...entry.collection.toArray];
	const values = state.scalarField ? rows.map((row) => row?.[state.scalarField]) : rows;
	if (state.materialization === `array`) return values;
	return values.map((value) => String(value ?? ``)).join(``);
}
function setupNestedPipelines(includes, syncState) {
	return includes.map((entry) => {
		const buffer = /* @__PURE__ */ new Map();
		entry.pipeline.pipe(output((data) => {
			const messages = data.getInner();
			syncState.messagesCount += messages.length;
			for (const [[childKey, tupleData], multiplicity] of messages) {
				const [childResult, _orderByIndex, correlationKey, parentContext] = tupleData;
				const routingKey = computeRoutingKey(correlationKey, parentContext);
				let byChild = buffer.get(routingKey);
				if (!byChild) {
					byChild = /* @__PURE__ */ new Map();
					buffer.set(routingKey, byChild);
				}
				const existing = byChild.get(childKey) || {
					deletes: 0,
					inserts: 0,
					value: childResult,
					orderByIndex: _orderByIndex
				};
				if (multiplicity < 0) existing.deletes += Math.abs(multiplicity);
				else if (multiplicity > 0) {
					existing.inserts += multiplicity;
					existing.value = childResult;
				}
				byChild.set(childKey, existing);
			}
		}));
		const setup = {
			compilationResult: entry,
			buffer
		};
		if (entry.childCompilationResult.includes) setup.nestedSetups = setupNestedPipelines(entry.childCompilationResult.includes, syncState);
		return setup;
	});
}
function createPerEntryIncludesStates(setups) {
	return setups.map((setup) => {
		const state = {
			fieldName: setup.compilationResult.fieldName,
			resultPath: setup.compilationResult.resultPath,
			childCorrelationField: setup.compilationResult.childCorrelationField,
			hasOrderBy: setup.compilationResult.hasOrderBy,
			materialization: setup.compilationResult.materialization,
			scalarField: setup.compilationResult.scalarField,
			childRegistry: /* @__PURE__ */ new Map(),
			pendingChildChanges: /* @__PURE__ */ new Map(),
			correlationToParentKeys: /* @__PURE__ */ new Map()
		};
		if (setup.nestedSetups) {
			state.nestedSetups = setup.nestedSetups;
			state.nestedRoutingIndex = /* @__PURE__ */ new Map();
			state.nestedRoutingReverseIndex = /* @__PURE__ */ new Map();
		}
		return state;
	});
}
function drainNestedBuffers(state) {
	const dirtyCorrelationKeys = /* @__PURE__ */ new Set();
	if (!state.nestedSetups) return dirtyCorrelationKeys;
	for (let i = 0; i < state.nestedSetups.length; i++) {
		const setup = state.nestedSetups[i];
		const toDelete = [];
		for (const [nestedCorrelationKey, childChanges] of setup.buffer) {
			const parentCorrelationKey = state.nestedRoutingIndex.get(nestedCorrelationKey);
			if (parentCorrelationKey === void 0) continue;
			const entry = state.childRegistry.get(parentCorrelationKey);
			if (!entry || !entry.includesStates) continue;
			const entryState = entry.includesStates[i];
			for (const [childKey, changes] of childChanges) {
				let byChild = entryState.pendingChildChanges.get(nestedCorrelationKey);
				if (!byChild) {
					byChild = /* @__PURE__ */ new Map();
					entryState.pendingChildChanges.set(nestedCorrelationKey, byChild);
				}
				const existing = byChild.get(childKey);
				if (existing) {
					existing.inserts += changes.inserts;
					existing.deletes += changes.deletes;
					if (changes.inserts > 0) {
						existing.value = changes.value;
						if (changes.orderByIndex !== void 0) existing.orderByIndex = changes.orderByIndex;
					}
				} else byChild.set(childKey, { ...changes });
			}
			dirtyCorrelationKeys.add(parentCorrelationKey);
			toDelete.push(nestedCorrelationKey);
		}
		for (const key of toDelete) setup.buffer.delete(key);
	}
	return dirtyCorrelationKeys;
}
function updateRoutingIndex(state, correlationKey, childChanges) {
	if (!state.nestedSetups) return;
	for (const setup of state.nestedSetups) for (const [, change] of childChanges) if (change.inserts > 0) {
		const nestedRouting = change.value[INCLUDES_ROUTING]?.[setup.compilationResult.fieldName];
		const nestedCorrelationKey = nestedRouting?.correlationKey;
		const nestedRoutingKey = computeRoutingKey(nestedCorrelationKey, nestedRouting?.parentContext ?? null);
		if (nestedCorrelationKey != null) {
			state.nestedRoutingIndex.set(nestedRoutingKey, correlationKey);
			let reverseSet = state.nestedRoutingReverseIndex.get(correlationKey);
			if (!reverseSet) {
				reverseSet = /* @__PURE__ */ new Set();
				state.nestedRoutingReverseIndex.set(correlationKey, reverseSet);
			}
			reverseSet.add(nestedRoutingKey);
		}
	} else if (change.deletes > 0 && change.inserts === 0) {
		const nestedRouting2 = change.value[INCLUDES_ROUTING]?.[setup.compilationResult.fieldName];
		const nestedCorrelationKey = nestedRouting2?.correlationKey;
		const nestedRoutingKey = computeRoutingKey(nestedCorrelationKey, nestedRouting2?.parentContext ?? null);
		if (nestedCorrelationKey != null) {
			state.nestedRoutingIndex.delete(nestedRoutingKey);
			const reverseSet = state.nestedRoutingReverseIndex.get(correlationKey);
			if (reverseSet) {
				reverseSet.delete(nestedRoutingKey);
				if (reverseSet.size === 0) state.nestedRoutingReverseIndex.delete(correlationKey);
			}
		}
	}
}
function cleanRoutingIndexOnDelete(state, correlationKey) {
	if (!state.nestedRoutingReverseIndex) return;
	const nestedKeys = state.nestedRoutingReverseIndex.get(correlationKey);
	if (nestedKeys) {
		for (const nestedKey of nestedKeys) state.nestedRoutingIndex.delete(nestedKey);
		state.nestedRoutingReverseIndex.delete(correlationKey);
	}
}
function hasNestedBufferChanges(setups) {
	for (const setup of setups) {
		if (setup.buffer.size > 0) return true;
		if (setup.nestedSetups && hasNestedBufferChanges(setup.nestedSetups)) return true;
	}
	return false;
}
function computeRoutingKey(correlationKey, parentContext) {
	if (parentContext == null) return correlationKey;
	return JSON.stringify([correlationKey, parentContext]);
}
function createChildCollectionEntry(parentId, fieldName, correlationKey, hasOrderBy, nestedSetups) {
	const resultKeys = /* @__PURE__ */ new WeakMap();
	const orderByIndices = hasOrderBy ? /* @__PURE__ */ new WeakMap() : null;
	let syncMethods = null;
	const compare = orderByIndices ? createOrderByComparator(orderByIndices) : void 0;
	const entry = {
		collection: createCollection({
			id: `__child-collection:${parentId}-${fieldName}-${serializeValue(correlationKey)}`,
			getKey: (item) => resultKeys.get(item),
			compare,
			sync: {
				rowUpdateMode: `full`,
				sync: (methods) => {
					syncMethods = methods;
					return () => {
						syncMethods = null;
					};
				}
			},
			startSync: true,
			gcTime: 0
		}),
		get syncMethods() {
			return syncMethods;
		},
		resultKeys,
		orderByIndices
	};
	if (nestedSetups) entry.includesStates = createPerEntryIncludesStates(nestedSetups);
	return entry;
}
function flushIncludesState(includesState, parentCollection, parentId, parentChanges, parentSyncMethods) {
	for (const state of includesState) {
		if (parentChanges) {
			for (const [parentKey, changes] of parentChanges) if (changes.inserts > 0) {
				const parentResult = changes.value;
				const routing = parentResult[INCLUDES_ROUTING]?.[state.fieldName];
				const correlationKey = routing?.correlationKey;
				const routingKey = computeRoutingKey(correlationKey, routing?.parentContext ?? null);
				if (correlationKey != null) {
					if (!state.childRegistry.has(routingKey)) {
						const entry = createChildCollectionEntry(parentId, state.fieldName, routingKey, state.hasOrderBy, state.nestedSetups);
						state.childRegistry.set(routingKey, entry);
					}
					let parentKeys = state.correlationToParentKeys.get(routingKey);
					if (!parentKeys) {
						parentKeys = /* @__PURE__ */ new Set();
						state.correlationToParentKeys.set(routingKey, parentKeys);
					}
					parentKeys.add(parentKey);
					const childValue = materializeIncludedValue(state, state.childRegistry.get(routingKey));
					setIncludedValue(parentResult, state.resultPath, childValue);
					const storedParent = parentCollection.get(parentKey);
					if (storedParent && storedParent !== parentResult) setIncludedValue(storedParent, state.resultPath, childValue);
				}
			}
		}
		const affectedCorrelationKeys = materializesInline(state) ? new Set(state.pendingChildChanges.keys()) : null;
		const entriesWithChildChanges = /* @__PURE__ */ new Map();
		if (state.pendingChildChanges.size > 0) {
			for (const [correlationKey, childChanges] of state.pendingChildChanges) {
				let entry = state.childRegistry.get(correlationKey);
				if (!entry) {
					entry = createChildCollectionEntry(parentId, state.fieldName, correlationKey, state.hasOrderBy, state.nestedSetups);
					state.childRegistry.set(correlationKey, entry);
				}
				if (state.materialization === `collection`) attachChildCollectionToParent(parentCollection, state.resultPath, correlationKey, state.correlationToParentKeys, entry.collection);
				if (entry.syncMethods) {
					entry.syncMethods.begin();
					for (const [childKey, change] of childChanges) {
						entry.resultKeys.set(change.value, childKey);
						if (entry.orderByIndices && change.orderByIndex !== void 0) entry.orderByIndices.set(change.value, change.orderByIndex);
						if (change.inserts > 0 && change.deletes === 0) entry.syncMethods.write({
							value: change.value,
							type: `insert`
						});
						else if (change.inserts > change.deletes || change.inserts === change.deletes && entry.syncMethods.collection.has(entry.syncMethods.collection.getKeyFromItem(change.value))) entry.syncMethods.write({
							value: change.value,
							type: `update`
						});
						else if (change.deletes > 0) entry.syncMethods.write({
							value: change.value,
							type: `delete`
						});
					}
					entry.syncMethods.commit();
				}
				updateRoutingIndex(state, correlationKey, childChanges);
				entriesWithChildChanges.set(correlationKey, {
					entry,
					childChanges
				});
			}
			state.pendingChildChanges.clear();
		}
		const dirtyFromBuffers = drainNestedBuffers(state);
		for (const [, { entry, childChanges }] of entriesWithChildChanges) if (entry.includesStates) flushIncludesState(entry.includesStates, entry.collection, entry.collection.id, childChanges, entry.syncMethods);
		for (const correlationKey of dirtyFromBuffers) {
			if (entriesWithChildChanges.has(correlationKey)) continue;
			const entry = state.childRegistry.get(correlationKey);
			if (entry?.includesStates) flushIncludesState(entry.includesStates, entry.collection, entry.collection.id, null, entry.syncMethods);
		}
		const deepBufferDirty = /* @__PURE__ */ new Set();
		if (state.nestedSetups) for (const [correlationKey, entry] of state.childRegistry) {
			if (entriesWithChildChanges.has(correlationKey)) continue;
			if (dirtyFromBuffers.has(correlationKey)) continue;
			if (entry.includesStates && hasPendingIncludesChanges(entry.includesStates)) {
				flushIncludesState(entry.includesStates, entry.collection, entry.collection.id, null, entry.syncMethods);
				deepBufferDirty.add(correlationKey);
			}
		}
		const inlineReEmitKeys = materializesInline(state) ? /* @__PURE__ */ new Set([
			...affectedCorrelationKeys || [],
			...dirtyFromBuffers,
			...deepBufferDirty
		]) : null;
		if (parentSyncMethods && inlineReEmitKeys && inlineReEmitKeys.size > 0) {
			const events = [];
			for (const correlationKey of inlineReEmitKeys) {
				const parentKeys = state.correlationToParentKeys.get(correlationKey);
				if (!parentKeys) continue;
				const entry = state.childRegistry.get(correlationKey);
				for (const parentKey of parentKeys) {
					const item = parentCollection.get(parentKey);
					if (item) {
						const previousValue = cloneForIncludesUpdate(item, state.resultPath);
						setIncludedValue(item, state.resultPath, materializeIncludedValue(state, entry));
						const nextValue = cloneForIncludesUpdate(item, state.resultPath);
						events.push({
							type: `update`,
							key: parentKey,
							value: nextValue,
							previousValue
						});
					}
				}
			}
			if (events.length > 0) parentCollection._changes.emitEvents(events, true);
		}
		if (parentChanges) {
			for (const [parentKey, changes] of parentChanges) if (changes.deletes > 0 && changes.inserts === 0) {
				const routing = changes.value[INCLUDES_ROUTING]?.[state.fieldName];
				const correlationKey = routing?.correlationKey;
				const routingKey = computeRoutingKey(correlationKey, routing?.parentContext ?? null);
				if (correlationKey != null) {
					const parentKeys = state.correlationToParentKeys.get(routingKey);
					if (parentKeys) {
						parentKeys.delete(parentKey);
						if (parentKeys.size === 0) {
							cleanRoutingIndexOnDelete(state, routingKey);
							state.childRegistry.delete(routingKey);
							state.correlationToParentKeys.delete(routingKey);
						}
					}
				}
			}
		}
	}
	if (parentChanges) for (const [, changes] of parentChanges) delete changes.value[INCLUDES_ROUTING];
}
function hasPendingIncludesChanges(states) {
	for (const state of states) {
		if (state.pendingChildChanges.size > 0) return true;
		if (state.nestedSetups && hasNestedBufferChanges(state.nestedSetups)) return true;
	}
	return false;
}
function attachChildCollectionToParent(parentCollection, resultPath, correlationKey, correlationToParentKeys, childCollection) {
	const parentKeys = correlationToParentKeys.get(correlationKey);
	if (!parentKeys) return;
	for (const parentKey of parentKeys) {
		const item = parentCollection.get(parentKey);
		if (item) setIncludedValue(item, resultPath, childCollection);
	}
}
function setIncludedValue(target, path, value) {
	const state = getFnSelectState(target);
	if (!state) {
		setNestedValue(target, path, value);
		return;
	}
	setNestedValue(state.sourceRow, path, value);
	refreshFnSelectResult(target, state);
}
function getFnSelectState(target) {
	return target[FN_SELECT_STATE];
}
function refreshFnSelectResult(target, state) {
	const targetRecord = target;
	const sourceRecord = state.sourceRow;
	const routing = targetRecord[INCLUDES_ROUTING] ?? sourceRecord[INCLUDES_ROUTING];
	const nextValue = state.fnSelect(state.sourceRow);
	if (!nextValue || typeof nextValue !== `object`) return;
	for (const key of Object.keys(target)) delete target[key];
	Object.assign(target, nextValue);
	if (routing) targetRecord[INCLUDES_ROUTING] = routing;
	Object.defineProperty(target, FN_SELECT_STATE, {
		value: state,
		enumerable: true,
		configurable: true
	});
}
function setNestedValue(target, path, value) {
	if (path.length === 0) return;
	let cursor = target;
	for (let i = 0; i < path.length - 1; i++) {
		const segment = path[i];
		const next = cursor[segment];
		if (next == null || typeof next !== `object`) cursor[segment] = {};
		cursor = cursor[segment];
	}
	cursor[path[path.length - 1]] = value;
}
function cloneForIncludesUpdate(target, path) {
	return getFnSelectState(target) ? { ...target } : clonePathForUpdate(target, path);
}
function clonePathForUpdate(target, path) {
	const root = { ...target };
	let sourceCursor = target;
	let cloneCursor = root;
	for (let i = 0; i < path.length - 1; i++) {
		const segment = path[i];
		const sourceValue = sourceCursor?.[segment];
		if (sourceValue == null || typeof sourceValue !== `object`) return root;
		const clonedValue = Array.isArray(sourceValue) ? [...sourceValue] : { ...sourceValue };
		cloneCursor[segment] = clonedValue;
		sourceCursor = sourceValue;
		cloneCursor = clonedValue;
	}
	return root;
}
function accumulateChanges(acc, [[key, tupleData], multiplicity]) {
	const [value, orderByIndex] = tupleData;
	const changes = acc.get(key) || {
		deletes: 0,
		inserts: 0,
		value,
		orderByIndex
	};
	if (multiplicity < 0) changes.deletes += Math.abs(multiplicity);
	else if (multiplicity > 0) {
		changes.inserts += multiplicity;
		changes.value = value;
		if (orderByIndex !== void 0) changes.orderByIndex = orderByIndex;
	}
	acc.set(key, changes);
	return acc;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+db@0.6.7_typescript@6.0.3/node_modules/@tanstack/db/dist/esm/query/live-query-collection.js
function liveQueryCollectionOptions(config) {
	return new CollectionConfigBuilder(config).getConfig();
}
function createLiveQueryCollection(configOrQuery) {
	if (typeof configOrQuery === `function`) return bridgeToCreateCollection(liveQueryCollectionOptions({ query: configOrQuery }));
	else {
		const config = configOrQuery;
		const options = liveQueryCollectionOptions(config);
		if (config.utils) options.utils = {
			...options.utils,
			...config.utils
		};
		return bridgeToCreateCollection(options);
	}
}
function bridgeToCreateCollection(options) {
	const collection = createCollection(options);
	const builder = getBuilderFromConfig(options);
	if (builder) registerCollectionBuilder(collection, builder);
	return collection;
}
//#endregion
export { createCollection as a, CollectionImpl as i, BaseQueryBuilder as n, localOnlyCollectionOptions as r, createLiveQueryCollection as t };
