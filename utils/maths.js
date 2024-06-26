/**
 * Maths utility methods.
 * @module maths
 */

// Result is integer between min and max inclusive.
export function randomInt(minVal, maxVal) {
  return minVal + Math.floor(Math.random() * (maxVal + 1 - minVal));
}

export function tangentPointsBetweenPointAndCircle(
  targetPt,
  circlePos,
  circleRadius,
) {
  const dd = distanceBetweenPoints(targetPt, circlePos);
  const a = Math.asin(circleRadius / dd); // Alpha angle
  const b = angleRadsBetweenPoints(targetPt, circlePos); // Beta angle
  let t = b - a; // Tangent angle A
  const ta = {
    x: circlePos.x + circleRadius * Math.sin(t),
    y: circlePos.y + circleRadius * -Math.cos(t),
  };
  t = b + a; // Tangent angle B
  const tb = {
    x: circlePos.x + circleRadius * -Math.sin(t),
    y: circlePos.y + circleRadius * Math.cos(t),
  };
  return [ta, tb];
}

/**
 * Rounds a number to nearest step, supporting optional starting offset.
 * @param {number} number - The target number.
 * @param {number} step - The step to round to.
 * @param {number} [offset=0] - Optional starting offset.
 * @returns {number} roundedResult
 */
export function roundToNearest(number, step, offset = 0) {
  if (offset != 0) {
    offset = offset - Math.round(offset / step) * step;
    return offset + Math.round((number - offset) / step) * step;
  } else {
    return Math.round(number / step) * step;
  }
}

/**
 * Returns the intersection point between two infinite length lines.
 * @param {vector} lineApoint0 - An object with `x` and `y` properties.
 * @param {vector} lineApoint1 - An object with `x` and `y` properties.
 * @param {vector} lineBpoint0 - An object with `x` and `y` properties.
 * @param {vector} lineBpoint1 - An object with `x` and `y` properties.
 * @returns {PIXI.Point|null} intersectionPoint - Will return null if lines don't intersect.
 */
//  export function intersectLineLine(a1, a2, b1, b2, applyToVector = null) {

//    let res = null;
//    const ua_t = (b2.x-b1.x)*(a1.y-b1.y)-(b2.y-b1.y)*(a1.x-b1.x);
//    const ub_t = (a2.x-a1.x)*(a1.y-b1.y)-(a2.y-a1.y)*(a1.x-b1.x);
//    const u_b = (b2.y-b1.y)*(a2.x-a1.x)-(b2.x-b1.x)*(a2.y-a1.y);
//    if (u_b != 0) {
//      const ua = ua_t/u_b;
//      const ub = ub_t/u_b;
//      if (applyToVector){
//        applyToVector.x = a1.x+ua*(a2.x-a1.x);
//        applyToVector.y = a1.y+ua*(a2.y-a1.y);
//        return null;
//      }
//      res = new Point(a1.x+ua*(a2.x-a1.x), a1.y+ua*(a2.y-a1.y));
//    }
//    return res;
//  }

/**
 * Returns the intersection point between two closed lines.
 * @param {vector} lineApoint0 - An object with `x` and `y` properties.
 * @param {vector} lineApoint1 - An object with `x` and `y` properties.
 * @param {vector} lineBpoint0 - An object with `x` and `y` properties.
 * @param {vector} lineBpoint1 - An object with `x` and `y` properties.
 * @returns {PIXI.Point|null} intersectionPoint - Will return null if segments don't intersect.
 */
//  export function intersectSegmentSegment(a1, a2, b1, b2) {

//    var res = null;
//    var ua_t = (b2.x-b1.x)*(a1.y-b1.y)-(b2.y-b1.y)*(a1.x-b1.x);
//    var ub_t = (a2.x-a1.x)*(a1.y-b1.y)-(a2.y-a1.y)*(a1.x-b1.x);
//    var u_b = (b2.y-b1.y)*(a2.x-a1.x)-(b2.x-b1.x)*(a2.y-a1.y);
//    if (u_b != 0) {
//      var ua = ua_t/u_b;
//      var ub = ub_t/u_b;
//      if (0<=ua && ua<=1 && 0<=ub && ub<=1) {
//        res = new Point(a1.x+ua*(a2.x-a1.x), a1.y+ua*(a2.y-a1.y));
//      }
//    }

//    return res;
//  };

/**
 * Returns the intersection point between two rays.
 * <br>A ray is an infinite line from origin point through the target point.
 * @param {vector} lineAorigin - An object with `x` and `y` properties.
 * @param {vector} lineAtarget - An object with `x` and `y` properties.
 * @param {vector} lineBorigin - An object with `x` and `y` properties.
 * @param {vector} lineBtarget - An object with `x` and `y` properties.
 * @returns {PIXI.Point|null} intersectionPoint - Will return null if the rays don't intersect.
 */
//  export function intersectRayRay(a1, a2, b1, b2) {

//    var res = null;
//    var ua_t = (b2.x-b1.x)*(a1.y-b1.y)-(b2.y-b1.y)*(a1.x-b1.x);
//    var ub_t = (a2.x-a1.x)*(a1.y-b1.y)-(a2.y-a1.y)*(a1.x-b1.x);
//    var u_b = (b2.y-b1.y)*(a2.x-a1.x)-(b2.x-b1.x)*(a2.y-a1.y);
//    if (u_b != 0) {
//      var ua = ua_t/u_b;
//      var ub = ub_t/u_b;
//      if (ua>=0 && ub>=0) {
//        res = new Point(a1.x+ua*(a2.x-a1.x), a1.y+ua*(a2.y-a1.y));
//      }
//    }

//    return res;

//  };

/**
 * Returns the intersection point between a line segment and the edges of a box.
 * @param {vector} segmentPoint0 - An object with `x` and `y` properties.
 * @param {vector} segmentPoint1 - An object with `x` and `y` properties.
 * @param {number} boxLeftX - The leftmost position of the box.
 * @param {number} boxTopY - The topmost position of the box.
 * @param {number} boxWidth - The box width.
 * @param {number} boxHeight - The box height.
 * @returns {PIXI.Point|null} intersectionPoint - Will return null if the segment doesn't intersect the box edge.
 * @private
 */
//  export function intersectSegmentBox(l1, l2, xb, yb, wb, hb) {

//    return intersectSegmentSegment(l1.x, l1.y, l2.x, l2.y, xb, yb, xb, yb + hb) ||
//          intersectSegmentSegment(l1.x, l1.y, l2.x, l2.y, xb + wb, yb, xb + wb, yb + hb) ||
//          intersectSegmentSegment(l1.x, l1.y, l2.x, l2.y, xb, yb + hb, xb + wb, yb + hb) ||
//          intersectSegmentSegment(l1.x, l1.y, l2.x, l2.y, xb, yb, xb + wb, yb)

//  }

/**
 * Returns the intersection point between a line segment and the edges of a box.
 * @param {vector} segmentPoint0 - An object with `x` and `y` properties.
 * @param {vector} segmentPoint1 - An object with `x` and `y` properties.
 * @param {rectangle} rectangle - An object with `x`, `y`, `width` and `height` properties.
 * @returns {PIXI.Point|null} intersectionPoint - Will return null if the segment doesn't intersect the box edge.
 * @private
 */
//  export function intersectSegmentRect(l1, l2, rect) {
//    return intersectSegmentBox(l1, l1, rect.x, rect.y, rect.width, rect.height)
//  }

/**
 * Returns an array of intersection points (with length between 0 and 2) between a circle and line segment.
 * @param {vector} segmentPoint0 - An object with `x` and `y` properties.
 * @param {vector} segmentPoint1 - An object with `x` and `y` properties.
 * @param {vector} circleCenter - An object with `x` and `y` properties.
 * @param {number} circleRadius
 * @returns {Array.<Vector>} intersectionPoints - Will return a list of intersection points, between 0 and 2.
 */
//  export function intersectionPtsBetweenCircleAndLineSeg(lineSegP0, lineSegP1, circleCenter, circleRadius){

//      // circle, line
//      let a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
//      v1 = {};
//      v2 = {};
//      v1.x = lineSegP1.x - lineSegP0.x;
//      v1.y = lineSegP1.y - lineSegP0.y;
//      v2.x = lineSegP0.x - circleCenter.x;
//      v2.y = lineSegP0.y - circleCenter.y;
//      b = (v1.x * v2.x + v1.y * v2.y);
//      c = 2 * (v1.x * v1.x + v1.y * v1.y);
//      b *= -2;
//      d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circleRadius * circleRadius));
//      if(isNaN(d)){ // no intercept
//        return [];
//      }
//      u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
//      u2 = (b + d) / c;
//      retP1 = {};   // return points
//      retP2 = {}
//      ret = []; // return array
//      if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
//          retP1.x = lineSegP0.x + v1.x * u1;
//          retP1.y = lineSegP0.y + v1.y * u1;
//          ret.push(retP1);
//      }
//      if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
//          retP2.x = lineSegP0.x + v1.x * u2;
//          retP2.y = lineSegP0.y + v1.y * u2;
//          ret.push(retP2);
//      }
//      return ret;

//  }

/**
 * Returns an array of intersection points (with length between 0 and 2) between 2 circles.
 * @param {vector} circleCenter0 - An object with `x` and `y` properties.
 * @param {number} circleRadius0
 * @param {vector} circleCenter1 - An object with `x` and `y` properties.
 * @param {number} circleRadius1
 * @returns {Array.<Vector>} intersectionPoints - Will return a list of intersection points, between 0 and 2.
 */
//  export function intersectionPtsBetweenCircles(pt_circle0_pos, int_circle0_radius, pt_circle1_pos, int_circle1_radius) {

//    var d = this.distanceBetweenPoints(pt_circle0_pos, pt_circle1_pos);

//    if (d>int_circle0_radius+int_circle1_radius || d<Math.abs(int_circle0_radius-int_circle1_radius)) {

//      return [];

//    } else {

//      var a = (Math.pow(int_circle0_radius, 2)-Math.pow(int_circle1_radius, 2)+Math.pow(d, 2))/(2*d);
//      var h = Math.sqrt(Math.pow(int_circle0_radius, 2)-Math.pow(a, 2));

//      var pt_p2 = new Object();
//      pt_p2["x"] = pt_circle0_pos["x"]+((a*(pt_circle1_pos["x"]-pt_circle0_pos["x"]))/d);
//      pt_p2["y"] = pt_circle0_pos["y"]+((a*(pt_circle1_pos["y"]-pt_circle0_pos["y"]))/d);
//      var pt_p3_a = {x:pt_p2["x"]+(h*(pt_circle1_pos["y"]-pt_circle0_pos["y"]))/d, y:pt_p2["y"]-(h*(pt_circle1_pos["x"]-pt_circle0_pos["x"]))/d};

//      var pt_p3_b = {x:-pt_p3_a["x"]+(2*pt_p2["x"]), y:-pt_p3_a["y"]+(2*pt_p2["y"])};

//      return [pt_p3_a, pt_p3_b];

//    }
//  };

/**
 * Calculates the perimter (circumference) of an ellipse.
 * @param {number} radiusX - The ellipse radius in the x axis.
 * @param {number} radiusY - The ellipse radius in the y axis.
 * @returns {number} perimeter - Will return the perimeter length of the ellipse.
 */
export function ellipsePerimeter(radX, radY) {
  return 2.0 * 3.14 * Math.sqrt((radX * radX + radY * radY) / (2.0 * 1.0));
}

/**
 * Converts angle from degrees to radians.
 * @param {number} angleDegrees - Angle in degrees.
 * @returns {number} angleRadians - Angle in radians.
 */
export function degToRad(deg) {
  return (deg / 180.0) * Math.PI;
}

/**
 * Converts angle from radians to degrees.
 * @param {number} angleRadians - Angle in radians.
 * @returns {number} angleDegrees - Angle in degrees.
 */
export function radToDeg(rad) {
  return (rad / Math.PI) * 180.0;
}

/**
 * Returns the distance between 2 vector points.
 * @param {vector} pointA - An object with `x` and `y` properties.
 * @param {vector} pointB - An object with `x` and `y` properties.
 * @returns {number} distance
 */
export function distanceBetweenPoints(ptA, ptB) {
  const dx = ptA.x - ptB.x;
  const dy = ptA.y - ptB.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Restricts a given value between 0 and 1 (inclusive).
 * @param {number} value
 * @returns {number} restrictedValue
 */
export function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * Restricts a given value between -1 and 1 (inclusive).
 * @param {number} value
 * @returns {number} restrictedValue
 */
export function clampNeg1Pos1(value) {
  return value < -1 ? -1 : value > 1 ? 1 : value;
}

/**
 * Returns the angle in radians between 2 points.
 * @param {vector} originPoint - An object with `x` and `y` properties.
 * @param {vector} destinationPoint - An object with `x` and `y` properties.
 * @returns {number} angleRadians - The angle in radians.
 */
export function angleRadsBetweenPoints(ptA, ptB) {
  return Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x);
}

/**
 * Returns the angle in degrees between 2 points.
 * @param {vector} originPoint - An object with `x` and `y` properties.
 * @param {vector} destinationPoint - An object with `x` and `y` properties.
 * @returns {number} angleDegrees - The angle in degrees.
 */
export function angleDegsBetweenPoints(ptA, ptB) {
  return (Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x) / Math.PI) * 180.0;
}

/**
 * Projects from a point at a given radian angle and distance.
 * @param {vector} originPoint - An object with `x` and `y` properties.
 * @param {number} angleRadians - The rotation angle, in radians.
 * @param {number} distance - The distance to project.
 * @returns {PIXI.Point} projectedPoint - A new point object.
 */
export function projectAngleRadsFromPoint(pt, angleRads, dist) {
  return {
    x: pt.x + dist * Math.cos(angleRads),
    y: pt.y + dist * Math.sin(angleRads),
  };
}

/**
 * Projects from a point at a given degree angle and distance.
 * @param {vector} originPoint - An object with `x` and `y` properties.
 * @param {number} angleDegrees - The rotation angle, in degrees.
 * @param {number} distance - The distance to project.
 * @returns {vector} projectedPoint - A new point object.
 */
export function projectAngleDegsFromPoint(pt, angleDegs, dist) {
  let angleRads = (angleDegs / 180.0) * Math.PI;
  return {
    x: pt.x + dist * Math.cos(angleRads),
    y: pt.y + dist * Math.sin(angleRads),
  };
}

/**
 * Returns the point projecting from one point to another at a set distance.
 * @param {vector} originPoint - An object with `x` and `y` properties.
 * @param {vector} targetPoint - An object with `x` and `y` properties.
 * @param {number} distance - The distance to project.
 * @returns {vector} projectedPoint - A new point object.
 */
export function projectDistance(ptA, ptB, dist) {
  const dx = ptA.x - ptB.x;
  const dy = ptA.y - ptB.y;
  const fullDist = Math.sqrt(dx * dx + dy * dy);
  return {
    x: ptA.x - dx * (dist / fullDist),
    y: ptA.y - dy * (dist / fullDist),
  };
}

/**
 * Rotates one point around another a given angle (in radians)
 * @param {vector} centerPoint - An object with `x` and `y` properties.
 * @param {vector} subjectPoint - An object with `x` and `y` properties.
 * @param {number} angleRadians - The rotation angle, in radians.
 * @param {boolean} overwrite - If true: `subjectPoint` will be updated with the result. If false: a new PIXI.Point object will be returned.
 * @returns {vector|null} result - The resulting coordinate.
 */
export function rotatePtAroundPtRad(centerPt, pt, angRads) {
  return {
    x:
      Math.cos(angRads) * (pt.x - centerPt.x) -
      Math.sin(angRads) * (pt.y - centerPt.y) +
      centerPt.x,
    y:
      Math.sin(angRads) * (pt.x - centerPt.x) +
      Math.cos(angRads) * (pt.y - centerPt.y) +
      centerPt.y,
  };
}

/**
 * Rotates one point around another a given angle (in degrees)
 * @param {vector} centerPoint - An object with `x` and `y` properties.
 * @param {vector} subjectPoint - An object with `x` and `y` properties.
 * @param {number} angleDegrees - The rotation angle, in degrees.
 * @param {boolean} overwrite - If true: `subjectPoint` will be updated with the result. If false: a new PIXI.Point object will be returned.
 * @returns {PIXI.Point|null} result - The resulting coordinate.
 */
export function rotatePtAroundPtDeg(centerPt, pt, angDegs, overwrite = false) {
  return rotatePtAroundPtRad(centerPt, pt, degToRad(angDegs), overwrite);
}

/**
 * Return the shortest angular offset (in radians) from a source angle (in radians) to a target angle (in radians).
 * <br>The result may be negative.
 * @param {number} sourceAngleRadians - The source angle in radians.
 * @param {number} targetAngleRadians - The target angle in radians.
 * @returns {number} offsetAngleRadians - The offset in radians.
 */
export function angularDeltaFromAnglesRad(sourceAngRads, targetAngRads) {
  return Math.atan2(
    Math.sin(targetAngRads - sourceAngRads),
    Math.cos(targetAngRads - sourceAngRads),
  );
}

/**
 * Return the shortest angular offset (in degrees) from a source angle (in degrees) to a target angle (in degrees).
 * <br>The result may be negative.
 * @param {number} sourceAngleDegrees - The source angle in degrees.
 * @param {number} targetAngleDegrees - The target angle in degrees.
 * @returns {number} offsetAngleDegrees - The offset in degrees.
 */
export function angularDeltaFromAnglesDeg(sourceAngDegs, targetAngDegs) {
  return radToDeg(
    angularDeltaFromAnglesRad(degToRad(sourceAngDegs), degToRad(targetAngDegs)),
  );
}

/**
 * Return the shortest angular offset (in degrees) in the given direction of travel from a source angle (in degrees) to a target angle (in degrees).
 * <br>The result may be negative.
 * @param {number} sourceAngleDegrees - The source angle in degrees.
 * @param {number} targetAngleDegrees - The target angle in degrees.
 * @param {number} direction - The direction (under 0 for CCW, over 0 for CW)
 * @returns {number} offsetAngleDegrees - The offset in degrees.
 */
//  export function angularDeltaFromAnglesForceDirDeg(sourceAngDegs, targetAngDegs, dir){
//    let delta = radToDeg(angularDeltaFromAnglesRad(degToRad(sourceAngDegs), degToRad(targetAngDegs)));
//    if (delta < 0.0 && dir > 0.0){
//      return 360 + delta;
//    } else if (delta > 0.0 && dir < 0.0){
//      return -360 + delta;
//    }
//    return delta;
//  }

/**
 * Given indexes that repeat from 0 to `totalCount`-1, return the offset from one to another in a set direction, negative or positive.
 * @param {number} indexFrom - The starting index. Must be positive integer under `totalCount`.
 * @param {number} indexTo - The target index. Must be positive integer under `totalCount`.
 * @param {number} dir - A number over or under zero. If dir is over 0 the resulting offset will be over zero and visa-versa.
 * @param {count} totalCount - The total number of indexes. Eg. The array length.
 * @returns {int} indexOffset - The offset between indexes.
 */
export function indexOffsetInDirection(indexFrom, indexTo, dir, totalCount) {
  if (indexFrom === indexTo) {
    return 0.0;
  }
  let indexOffset = indexTo - indexFrom;
  if (dir > 0.0 && indexOffset < 0.0) {
    indexOffset += totalCount;
  } else if (dir < 0.0 && indexOffset > 0.0) {
    indexOffset -= totalCount;
  }
  return indexOffset;
}

/**
 * Given indexes that repeat from 0 to `totalCount`-1, return the shortest offset from one to another in any direction.
 * @param {number} indexFrom - The starting index. Must be positive integer under `totalCount`.
 * @param {number} indexTo - The target index. Must be positive integer under `totalCount`.
 * @param {count} totalCount - The total number of indexes. Eg. The array length.
 * @returns {int} indexOffset - The offset between indexes. Result may be negative.
 */
export function shortestIndexOffset(indexFrom, indexTo, totalCount) {
  if (indexFrom === indexTo) {
    return 0.0;
  }
  let indexOffset =
    indexTo - (indexFrom + (indexTo > indexFrom ? totalCount : 0.0));
  if (Math.abs(indexOffset) > totalCount * 0.5) {
    indexOffset += totalCount;
  }
  return indexOffset;
}
