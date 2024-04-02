

/**
 * Given source dimensions, returns the scale needed to completely cover the given bounds while maintaining aspect ratio.
 * @param {number} sourceWidth - The source width.
 * @param {number} sourceHeight - The source height.
 * @param {number} boundsWidth - The bounds width.
 * @param {number} boundsHeight - The bounds height.
 * @returns {number} scale - The resulting scale.
 */
export function coverScale(srcW, srcH, boundsW, boundsH) {

	var ratioSrc = srcW/srcH;
	var ratioBounds = boundsW/boundsH;
	
	if (ratioSrc<ratioBounds) {
		return boundsW/srcW;
	} else {
		return boundsH/srcH;
	}
	
};

/**
 * Returns the scale needed to contain the source dimensions exactly within the given bounds while maintaining aspect ratio.
 * @param {number} sourceWidth - The source width.
 * @param {number} sourceHeight - The source height.
 * @param {number} boundsWidth - The bounds width.
 * @param {number} boundsHeight - The bounds height.
 * @returns {number} scale - The resulting scale.
 */
export function containScale(srcW, srcH, boundsW, boundsH) {

	var ratioSrc = srcW/srcH;
	var ratioBounds = boundsW/boundsH;
	
	if (ratioSrc>=ratioBounds) {
		return boundsW/srcW;
	} else {
		return boundsH/srcH;
	}
	
};
