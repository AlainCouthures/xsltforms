<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:template match="/">
		<html>
			<head>
				<title>Dump of Environment Variables</title>
			</head>
			<body>
				<ul>
					<li>
						<b>Version: </b>
						<xsl:value-of select="system-property('xsl:version')"/>
					</li>
					<li>
						<b>Vendor: </b>
						<xsl:value-of select="system-property('xsl:vendor')"/>
					</li>
					<li>
						<b>Vendor URL: </b>
						<xsl:value-of select="system-property('xsl:vendor-url')"/>
					</li>
					<!-- <li><b>Java Version: </b><xsl:value-of select="system-property('java.version')"/> 
						<li><b>OS Name: </b><xsl:value-of select="system-property('os.name')"/></li>	
					<li><b>File Separator: </b><xsl:value-of select="system-property('file.separator')"/>
						</li></li>-->
				</ul>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
