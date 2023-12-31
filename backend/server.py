from flask import Flask, request, send_file
from flask_cors import CORS
import cv2
from moviepy.editor import VideoFileClip


app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("failed")
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        print("failed")
        return 'No selected file'
    print("passed")

    file.save('./inputVideos/raw.mp4')

    video = cv2.VideoCapture('./inputVideos/raw.mp4')

    background = None
    first_done = False

    # Initialize result video
    fps = video.get(cv2.CAP_PROP_FPS)
    result_vid = cv2.VideoWriter("result.mp4",
                                 cv2.VideoWriter_fourcc('m', 'p', '4', 'v'),
                                 fps, (960, 600))

    # Loop over frames of video
    while video.isOpened():
        status, frame = video.read()
        if status:
            # Resize and filter frame
            frame = cv2.resize(frame, (960, 600))
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.GaussianBlur(gray, (13, 13), 0)

            if not first_done:
                background = gray
                first_done = True

            # Find difference between frame and background
            diff = cv2.absdiff(background, gray)

            # Binary Thresholding
            thresh = cv2.threshold(diff, 20, 255, cv2.THRESH_BINARY)[1]
            # noinspection PyTypeChecker
            thresh = cv2.dilate(thresh, None, iterations=2)

            # Bounding box
            contours, result = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                                                cv2.CHAIN_APPROX_SIMPLE)

            for contour in contours:
                if cv2.contourArea(contour) > 5:
                    (x, y, w, h) = cv2.boundingRect(contour)
                    cv2.rectangle(frame, (x, y), (x + w, y + h),
                                  (0, 255, 0), 1)

            # cv2.imshow("Gray Video", gray)
            # cv2.imshow("Threshold Video", thresh)
            # cv2.imshow("Diff Video", diff)
            result_vid.write(frame)
            # cv2.imshow("All Contours", frame)

            key = cv2.waitKey(1)
            if key == ord('q'):
                break
        else:
            break

    video.release()
    result_vid.release()
    cv2.destroyAllWindows()

    video_clip = VideoFileClip("./result.mp4")

    # Convert the video clip to WebM format
    video_clip.write_videofile(
        "result.webm", codec='libvpx', preset='ultrafast', threads=4)

    video_clip.close()

    return send_file('./result.webm', as_attachment=True)


if __name__ == '__main__':
    app.run()
