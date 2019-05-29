using System;

namespace ConsoleApp
{
    class ImageProxyExample
    {
        public static void Main()
        {
            Image highResolutionImageProxy = new ImageProxy("sample/veryHighResPhoto1.jpeg");

            // assume that the user clicks on Image one item in a list
            // this would cause the program to call showImage() for that image only
            // note that in this case only image one was loaded into memory
            highResolutionImageProxy.ShowImage();

            Console.WriteLine();
            // consider using the high resolution image object directly
            Image highResolutionImage = new HighResolutionImage("sample/veryHighResPhoto1.jpeg");

            // assume that the user selects image two item from images list
            highResolutionImage.ShowImage();

            // note that in this case all images have been loaded into memory 
            // and not all have been actually displayed
            // this is a waste of memory resources
        }
    }

    public interface Image
    {
        void ShowImage();
    }

    public class ImageProxy : Image
    {
        /**
         * Private Proxy data 
         */
        private string imageFilePath;

        /**
         * Reference to RealSubject
         */
        private Image proxifiedImage;

        public ImageProxy(string imageFilePath)
        {
            Console.WriteLine("Don't actually load the image");
            this.imageFilePath = imageFilePath;
        }

        public void ShowImage()
        {
            // create the Image Object only when the image is required to be shown
            proxifiedImage = new HighResolutionImage(imageFilePath);
            // now call showImage on realSubject
            proxifiedImage.ShowImage();
        }
    }

    public class HighResolutionImage : Image
    {
        public HighResolutionImage(string imageFilePath)
        {
            loadImage(imageFilePath);
        }

        private void loadImage(string imageFilePath)
        {
            Console.WriteLine("load Image from disk into memory");
            Console.WriteLine("this is heavy and costly operation");
        }

        public void ShowImage()
        {
            Console.WriteLine("Actual Image rendering logic");
        }
    }
}
