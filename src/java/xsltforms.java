import java.awt.FileDialog;
import java.awt.Frame;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.AccessController;
import java.security.PrivilegedAction;

public class xsltforms extends java.applet.Applet {
	public static String lastChosenFileName = new String("");
	public String readFile(final String filename, final String encoding, final String xsdtype, final String title) {
		return (String)AccessController.doPrivileged(new PrivilegedAction() {
			public Object run() {		
				try {
					String fn = filename;
					if (fn.equals("")) {
						fn = lastChosenFileName;
					}
					if (!title.equals("")) {
						FileDialog fd = new FileDialog(new Frame(), title, FileDialog.LOAD);
						if (!filename.equals("")) {
							File file = new File(filename);
							fd.setFile(file.getName());
							File parent = file.getParentFile();
							if (parent != null) {
								fd.setDirectory(parent.getPath());
							}
						}
						fd.setVisible(true);
						fn = fd.getFile();
						if (fn == null) {
							fd.dispose();
							return "";
						}
						fn = fd.getDirectory() + fn;
						lastChosenFileName = fn;
						fd.dispose();
					}
					String lfilename = fn.toLowerCase().trim();
					if (lfilename.endsWith(".bat") ||
						lfilename.endsWith(".cer") ||
						lfilename.endsWith(".cmd") ||
						lfilename.endsWith(".com") ||
						lfilename.endsWith(".cpl") ||
						lfilename.endsWith(".crt") ||
						lfilename.endsWith(".dll") ||
						lfilename.endsWith(".exe") ||
						lfilename.endsWith(".hta") ||
						lfilename.endsWith(".inf") ||
						lfilename.endsWith(".js")  ||
						lfilename.endsWith(".jse") ||
						lfilename.endsWith(".lnk") ||
						lfilename.endsWith(".msc") ||
						lfilename.endsWith(".msi") ||
						lfilename.endsWith(".msp") ||
						lfilename.endsWith(".ocx") ||
						lfilename.endsWith(".pif") ||
						lfilename.endsWith(".reg") ||
						lfilename.endsWith(".scr") ||
						lfilename.endsWith(".sct") ||
						lfilename.endsWith(".sys") ||
						lfilename.endsWith(".url") ||
						lfilename.endsWith(".vbs") ||
						lfilename.endsWith(".wsc") ||
						lfilename.endsWith(".wsf") ||
						lfilename.endsWith(".wsh")) {
						return "";
					}
					File f = new File(fn);
					if (f.length() > 100*1024*1024) {
						return "";
					}
					int flength = (int)f.length();
					byte[] buffer = new byte[flength];
					int efflength = 0;
					int nb;
					FileInputStream fs = new FileInputStream(f);
					while ((nb = fs.read(buffer, efflength, flength-efflength)) > 0) {
						efflength += nb;
					}
					fs.close();
					if (xsdtype.equals("base64Binary")) {
						String s1 = new String(buffer, 0, efflength, encoding);
						String s2 = new String("");
						String codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
						for (int i = 0; i < s1.length(); i += 3) {
							char c[] = new char[4];
							char c1 = s1.charAt(i);
							char c2 = i < s1.length()-1 ? s1.charAt(i+1) : 0;
							char c3 = i < s1.length()-2 ? s1.charAt(i+2) : 0;
							int b = ((c1 & 0xff) << 16) + ((c2 & 0xff) << 8) + (c3 & 0xff);
							c[0] = codes.charAt((b >> 18) & 0x3f);
							c[1] = codes.charAt((b >> 12) & 0x3f);
							c[2] = i < s1.length()-1 ? codes.charAt((b >> 6) & 0x3f) : '=';
							c[3] = i < s1.length()-2 ? codes.charAt(b & 0x3f) : '=';
							s2 += new String(c);
						}
						return s2;
					} else if (xsdtype.equals("hexBinary")) {
						String s1 = new String(buffer, 0, efflength, encoding);
						String s2 = new String("");
						for (int i = 0; i < s1.length(); i++) {
							char c[] = new char[2];
							char c1 = (char)((s1.charAt(i) >> 4) & 0xF);
							c[0] = (char)(c1 < 10 ? '0'+c1 : 'A'-10+c1);
							char c2 = (char)(s1.charAt(i) & 0xF);
							c[1] = (char)(c2 < 10 ? '0'+c2 : 'A'-10+c2);
							s2 += new String(c);
						}
						return s2;
					} else {
						return new String(buffer, 0, efflength, encoding);
					}
				} catch (Exception e) {
					return "";
				}
			}
		});
	}
	public int writeFile(final String filename, final String encoding, String xsdtype, final String title, String data) {
		if (data.length() > 100*1024*1024) {
			return 0;
		}
		String s = new String("");
		if (xsdtype.equals("base64Binary")) {
			if (data.length() % 4 != 0) {
				return 0;
			}
			for (int i = 0; i < data.length(); i += 4) {
				char c[] = new char[1];
				char c0 = data.charAt(i);
				int b = (c0 == '/' ? 63 : c0 == '+' ? 62 : c0 < 'A' ? c0+52-'0' : c0 < 'a' ? c0-'A' : c0+26-'a') << 18;
				char c1 = data.charAt(i+1);
				b += ((c1 == '/' ? 63 : c1 == '+' ? 62 : c1 < 'A' ? c1+52-'0' : c1 < 'a' ? c1-'A' : c1+26-'a') & 0x3f) << 12;
				char c2 = data.charAt(i+2);
				b += c2 == '=' ? 0 : ((c2 == '/' ? 63 : c2 == '+' ? 62 : c2 < 'A' ? c2+52-'0' : c2 < 'a' ? c2-'A' : c2+26-'a') & 0x3f) << 6;
				char c3 = data.charAt(i+3);
				b += c3 == '=' ? 0 : (c3 == '/' ? 63 : c3 == '+' ? 62 : c3 < 'A' ? c3+52-'0' : c3 < 'a' ? c3-'A' : c3+26-'a') & 0x3f;
				c[0] = (char)(b >> 16);
				s += new String(c);
				if (data.charAt(i+2) != '=') {
					c[0] = (char)((b >> 8) & 0xff);
					s += new String(c);
				}
				if (data.charAt(i+3) != '=') {
					c[0] = (char)(b & 0xff);
					s += new String(c);
				}
			}
		} else if (xsdtype.equals("hexBinary")) {
			if (data.length() % 2 == 1) {
				return 0;
			}
			for (int i = 0; i < data.length(); i += 2) {
				char c[] = new char[1];
				c[0] = (char)(((data.charAt(i) < 'A' ? data.charAt(i)-'0' : data.charAt(i)+10-'A') << 4) + ((data.charAt(i+1) < 'A' ? data.charAt(i+1)-'0' : data.charAt(i+1)+10-'A') & 0xf));
				s += new String(c);
			}
		} else {
			s = data;
		}
		final String finaldata = s;
		return ((Integer)AccessController.doPrivileged(new PrivilegedAction() {
			public Object run() {		
				try {
					String fn = filename;
					if (!title.equals("")) {
						FileDialog fd = new FileDialog(new Frame(), title, FileDialog.SAVE);
						if (!filename.equals("")) {
							File file = new File(filename);
							fd.setFile(file.getName());
							File parent = file.getParentFile();
							if (parent != null) {
								fd.setDirectory(parent.getPath());
							}
						}
						fd.setVisible(true);
						fn = fd.getFile();
						if (fn == null) {
							fd.dispose();
							return new Integer(2);
						}
						fn = fd.getDirectory() + fn;
						lastChosenFileName = fn;
						fd.dispose();
					}
					String lfilename = fn.toLowerCase().trim();
					if (lfilename.endsWith(".bat") ||
						lfilename.endsWith(".cer") ||
						lfilename.endsWith(".cmd") ||
						lfilename.endsWith(".com") ||
						lfilename.endsWith(".cpl") ||
						lfilename.endsWith(".crt") ||
						lfilename.endsWith(".dll") ||
						lfilename.endsWith(".exe") ||
						lfilename.endsWith(".hta") ||
						lfilename.endsWith(".inf") ||
						lfilename.endsWith(".js")  ||
						lfilename.endsWith(".jse") ||
						lfilename.endsWith(".lnk") ||
						lfilename.endsWith(".msc") ||
						lfilename.endsWith(".msi") ||
						lfilename.endsWith(".msp") ||
						lfilename.endsWith(".ocx") ||
						lfilename.endsWith(".pif") ||
						lfilename.endsWith(".reg") ||
						lfilename.endsWith(".scr") ||
						lfilename.endsWith(".sct") ||
						lfilename.endsWith(".sys") ||
						lfilename.endsWith(".url") ||
						lfilename.endsWith(".vbs") ||
						lfilename.endsWith(".wsc") ||
						lfilename.endsWith(".wsf") ||
						lfilename.endsWith(".wsh")) {
						return new Integer(0);
					}
					FileOutputStream fs = new FileOutputStream(fn);
					fs.write(finaldata.getBytes(encoding));
					fs.close();
					return new Integer(1);
				} catch (Exception e) {
					return new Integer(0);
				}
			}
		})).intValue();
	}
}