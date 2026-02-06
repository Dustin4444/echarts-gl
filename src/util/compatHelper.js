/**
 * Compatibility helpers for echarts 6.
 *
 * In echarts 6, DataStore.initData unconditionally calls provider.getSource()
 * on custom data providers. Custom providers that only define {count, getItem}
 * (without getSource) will throw "provider.getSource is not a function".
 *
 * This helper wraps such providers so they are compatible with echarts 6.
 */

/**
 * Ensure data passed to SeriesData.initData is compatible with echarts 6.
 * If data is a custom provider object (has count/getItem but no getSource),
 * add the required getSource method.
 *
 * @param {Array|Object} data - The data or custom provider.
 * @returns {Array|Object} The data, possibly patched with getSource.
 */
export function ensureDataProvider(data) {
    if (
        data
        && typeof data === 'object'
        && !Array.isArray(data)
        && typeof data.count === 'function'
        && typeof data.getItem === 'function'
        && typeof data.getSource !== 'function'
    ) {
        data.getSource = function () {
            return {
                sourceFormat: 'original',
                // Minimal Source-like shape expected by DataStore
                seriesLayoutBy: 'column',
                startIndex: 0,
                dimensionsDefine: null
            };
        };
        // DataStore may also check these properties
        if (data.persistent == null) {
            data.persistent = true;
        }
    }
    return data;
}
