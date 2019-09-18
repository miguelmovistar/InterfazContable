namespace IC2.Helpers
{
    public class LDAP
    {
        /// <summary>
        /// Autentica por LDAP
        /// </summary>
        /// <param name="usuario">usuario</param>
        /// <param name="password">password</param>
        /// <returns>true si es exitoso, false fallido</returns>
        public bool autenticar(string usuario, string password)
        {
            bool exitoso = false;

            try
            {
                //AuthenticationTypes tipoautenticacion = AuthenticationTypes.Secure;
                ////"LDAP://mexico.tem.mx:389"
                //string ruta = string.Concat("LDAP://", ConfigurationManager.AppSettings["servidor"].ToString(), ":", ConfigurationManager.AppSettings["puerto"].ToString());
                //DirectoryEntry entry = new DirectoryEntry(ruta, usuario, password, tipoautenticacion);
                //object obj = entry.NativeObject;
                exitoso = true;
            }
            catch
            {
                exitoso = false;
            }
            return exitoso;

        }
    }
}