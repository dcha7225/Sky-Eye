import cv2
import time

video = cv2.VideoCapture("test4.mp4")
video.set(cv2.CAP_PROP_FPS, 60)

background = None
first_done = False

while video.isOpened():
	status, frame = video.read()
	if status:
		frame = cv2.resize(frame, (960, 600))
		gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
		gray = cv2.GaussianBlur(gray, (13, 13), 0)

		if not first_done:
			background = gray
			first_done = True

		diff = cv2.absdiff(background, gray)

		thresh = cv2.threshold(diff, 20, 255, cv2.THRESH_BINARY)[1]
		# noinspection PyTypeChecker
		thresh = cv2.dilate(thresh, None, iterations=2)

		contours, result = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
											cv2.CHAIN_APPROX_SIMPLE)

		for contour in contours:
			if cv2.contourArea(contour) > 5:
				(x, y, w, h) = cv2.boundingRect(contour)
				cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 1)

		# cv2.imshow("Threshold Video", thresh)
		cv2.imshow("All Contours", frame)
		# cv2.imshow("Diff Video", diff)
		# cv2.imshow("Gray Video", gray)

		key = cv2.waitKey(2)
		if key == ord('q'):
			break
	else:
		break

video.release()
cv2.destroyAllWindows()
